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
  VStack,
} from "@hope-ui/solid"
import { MaybeLoading } from "~/components"
import { useFetch, useRouter, useT } from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { PEmptyResp, PResp, Backup, MODE } from "~/types"
import { createStore } from "solid-js/store"

const AddOrEdit = () => {
  const t = useT()
  const { params, back } = useRouter()
  const { id } = params
  const [backup, setBackup] = createStore<Backup>({
    id: 0,
    server_id: "",
    src: "",
    dst: "",
    ignore: "",
    disabled: false,
    mode: MODE.EVENT,
    polling_interval: 60,
    init_upload: false,
  })
  const [backupLoading, loadBackup] = useFetch(
    (): PResp<Backup> => r.get(`/admin/backup/get?id=${id}`),
  )

  const initEdit = async () => {
    const resp = await loadBackup()
    handleResp(resp, setBackup)
  }
  if (id) {
    initEdit()
  }
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
            {t(`backup.src_dir`)}
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
            {t(`backup.dst_dir`)}
          </FormLabel>
          <Textarea
            id="dst"
            value={id != undefined ? backup.dst.split(";").join("\n") : ""}
            onInput={(e) =>
              setBackup("dst", e.currentTarget.value.split("\n").join(";"))
            }
          />
          <FormHelperText>{t("backup.multi_support_tips")}</FormHelperText>
        </FormControl>

        <FormControl w="$full" display="flex" flexDirection="column">
          <FormLabel for="ignore" display="flex" alignItems="center">
            {t(`backup.ignore`)}
          </FormLabel>
          <Textarea
            id="ignore"
            value={id != undefined ? backup.ignore.split(";").join("\n") : ""}
            onInput={(e) =>
              setBackup("ignore", e.currentTarget.value.split("\n").join(";"))
            }
          />
          <FormHelperText>{t("backup.ignore_tips")}</FormHelperText>
        </FormControl>

        <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="mode" display="flex" alignItems="center">
            {t(`backup.mode`)}
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
                <SelectOption value={MODE.POLLING}>
                  <SelectOptionText>{"Polling"}</SelectOptionText>
                  <SelectOptionIndicator />
                </SelectOption>
              </SelectListbox>
            </SelectContent>
          </Select>
          <FormHelperText>{t("backup.mode_tips")}</FormHelperText>
        </FormControl>
        <FormControl w="$full" display="flex" flexDirection="column">
          <FormLabel for="polling_interval" display="flex" alignItems="center">
            {t(`backup.polling_interval`)}
          </FormLabel>
          <Input
            type="number"
            id="polling_interval"
            value={id != undefined ? backup.polling_interval : 60}
            onInput={(e) => parseInt(e.currentTarget.value)}
          />
          <FormHelperText>{t("backup.interval_unit")}</FormHelperText>
        </FormControl>

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
            {t(`backup.init_upload`)}
          </Checkbox>
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
            {t(`backup.disabled`)}
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
