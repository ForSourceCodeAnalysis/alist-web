import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectTrigger,
  SelectValue,
  Textarea,
  Tag,
  VStack,
} from "@hope-ui/solid"
import { MaybeLoading } from "~/components"
import { createSignal, Show } from "solid-js"
import { useFetch, useRouter, useT } from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { PEmptyResp, PResp, AutoBackup, MODE } from "~/types"
import { createStore } from "solid-js/store"
import { isValidCron } from "cron-validator"

const AddOrEdit = () => {
  const t = useT()
  const { params, back } = useRouter()
  const { id } = params
  const [backup, setBackup] = createStore<AutoBackup>({
    id: 0,
    server_id: "",
    src: "",
    dst: "",
    ignore: "",
    disabled: false,
    mode: MODE.EVENT,
    cron: "0 * * * *",
    init_upload: false,
  })
  const [backupLoading, loadBackup] = useFetch(
    (): PResp<AutoBackup> => r.get(`/admin/backup/get?id=${id}`),
  )

  const initEdit = async () => {
    const resp = await loadBackup()
    handleResp(resp, setBackup)
  }
  if (id) {
    initEdit()
  }
  const [isCronValid, setIsCronValid] = createSignal(true)

  const [okLoading, ok] = useFetch((): PEmptyResp => {
    console.log(backup)
    return r.post(`/admin/backup/${id ? "update" : "create"}`, backup)
  })
  return (
    <MaybeLoading loading={backupLoading()}>
      <VStack w="$full" alignItems="start" spacing="$2">
        <Heading>{t(`global.${id ? "edit" : "add"}`)}</Heading>
        <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="src" display="flex" alignItems="center">
            {t(`auto_backup.src_dir`)}
          </FormLabel>
          <Input
            id="src"
            value={backup.src}
            readOnly={id != undefined}
            onInput={(e) => setBackup("src", e.currentTarget.value)}
          />
        </FormControl>
        <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="dst" display="flex" alignItems="center">
            {t(`auto_backup.dst_dir`)}
          </FormLabel>
          <Textarea
            id="dst"
            value={id != undefined ? backup.dst.split(";").join("\n") : ""}
            onInput={(e) =>
              setBackup("dst", e.currentTarget.value.split("\n").join(";"))
            }
          />
          <FormHelperText>{t("auto_backup.multi_support_tips")}</FormHelperText>
        </FormControl>

        <FormControl w="$full" display="flex" flexDirection="column">
          <FormLabel for="ignore" display="flex" alignItems="center">
            {t(`auto_backup.ignore`)}
          </FormLabel>
          <Textarea
            id="ignore"
            value={id != undefined ? backup.ignore.split(";").join("\n") : ""}
            onInput={(e) =>
              setBackup("ignore", e.currentTarget.value.split("\n").join(";"))
            }
          />
          <FormHelperText>{t("auto_backup.ignore_tips")}</FormHelperText>
        </FormControl>

        <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="mode" display="flex" alignItems="center">
            {t(`auto_backup.mode`)}
          </FormLabel>
          <Select
            id="mode"
            value={id != undefined ? backup.mode : MODE.EVENT}
            onChange={(e) => setBackup("mode", e)}
          >
            <SelectTrigger>
              <SelectValue />
              <SelectIcon />
            </SelectTrigger>
            <SelectContent>
              <SelectListbox>
                <SelectOption value={MODE.EVENT}>
                  <SelectOptionText>{"Event"}</SelectOptionText>
                  <SelectOptionIndicator />
                </SelectOption>
                <SelectOption value={MODE.CRON}>
                  <SelectOptionText>{"Cron"}</SelectOptionText>
                  <SelectOptionIndicator />
                </SelectOption>
              </SelectListbox>
            </SelectContent>
          </Select>
          <FormHelperText>{t("auto_backup.mode_tips")}</FormHelperText>
        </FormControl>
        <Show when={backup.mode === MODE.CRON}>
          <FormControl
            w="$full"
            display="flex"
            flexDirection="column"
            invalid={!isCronValid()}
          >
            <FormLabel for="cron" display="flex" alignItems="center">
              {t(`auto_backup.cron_expression`)}
            </FormLabel>
            <Input
              id="cron"
              value={backup.cron == "" ? "0 * * * *" : backup.cron}
              onInput={(e) => {
                const v = e.currentTarget.value.trim()
                setBackup("cron", v)
                setIsCronValid(isValidCron(v))
              }}
              onblur={(e) => {
                setIsCronValid(isValidCron(e.currentTarget.value))
              }}
            />
            {!isCronValid() && (
              <FormHelperText color="$danger10">
                {t("auto_backup.invalid_cron")}
              </FormHelperText>
            )}

            <FormHelperText>
              <div innerHTML={t("auto_backup.cron_tips")} />
            </FormHelperText>
          </FormControl>
        </Show>

        <FormControl w="fit-content" display="flex">
          <Checkbox
            css={{ whiteSpace: "nowrap" }}
            id="init_upload"
            onChange={(e: any) =>
              setBackup("init_upload", e.currentTarget.checked)
            }
            color="$neutral10"
            fontSize="$sm"
            checked={backup.init_upload}
          >
            {t(`auto_backup.init_upload`)}
          </Checkbox>
          <FormHelperText color="$neutral10">
            {t(`auto_backup.init_upload_tips`)}
          </FormHelperText>
        </FormControl>

        <FormControl w="fit-content" display="flex">
          <Checkbox
            css={{ whiteSpace: "nowrap" }}
            id="disabled"
            onChange={(e: any) =>
              setBackup("disabled", e.currentTarget.checked)
            }
            color="$neutral10"
            fontSize="$sm"
            checked={backup.disabled}
          >
            {t(`auto_backup.disabled`)}
          </Checkbox>
        </FormControl>

        <Button
          loading={okLoading()}
          onClick={async () => {
            const resp = await ok()
            handleResp(resp, () => {
              notify.success(t("global.save_success"))
              back()
            })
          }}
        >
          {t(`global.${id ? "save" : "add"}`)}
        </Button>
      </VStack>
    </MaybeLoading>
  )
}

export default AddOrEdit
