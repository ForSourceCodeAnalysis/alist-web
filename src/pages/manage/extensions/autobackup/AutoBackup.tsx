import {
  Box,
  Button,
  Checkbox,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@hope-ui/solid"
import { createSignal, For } from "solid-js"
import {
  useFetch,
  useListFetch,
  useManageTitle,
  useRouter,
  useT,
} from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { AutoBackup, PPageResp, PEmptyResp } from "~/types"
import { DeletePopover } from "../../common/DeletePopover"
import { Wether } from "~/components"

const Backup = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.auto_backup")
  const { to } = useRouter()
  const [getBackupLoading, getBackup] = useFetch(
    (): PPageResp<AutoBackup> => r.get("/admin/backup/list"),
  )
  const [backup, setBackup] = createSignal<AutoBackup[]>([])
  const refresh = async () => {
    const resp = await getBackup()
    handleResp(resp, (data) => setBackup(data.content))
  }
  refresh()

  const [deleting, deleteBackup] = useListFetch(
    (id: number): PEmptyResp => r.post(`/admin/backup/delete?id=${id}`),
  )

  return (
    <VStack spacing="$2" alignItems="start" w="$full">
      <HStack spacing="$2">
        <Button
          colorScheme="accent"
          loading={getBackupLoading()}
          onClick={refresh}
        >
          {t("global.refresh")}
        </Button>
        <Button
          onClick={() => {
            to("/@manage/backup/add")
          }}
        >
          {t("global.add")}
        </Button>
      </HStack>
      <Box w="$full" overflowX="auto">
        <Table highlightOnHover dense>
          <Thead>
            <Tr>
              <For each={["src_dir", "dst_dir", "ignore", "available"]}>
                {(title) => <Th>{t(`auto_backup.${title}`)}</Th>}
              </For>
              <Th>{t("global.operations")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            <For each={backup()}>
              {(b) => (
                <Tr>
                  <Td>{b.src}</Td>
                  <Td css={{ whiteSpace: "pre-wrap" }}>
                    {b.dst.split(";").join("\n")}
                  </Td>
                  <Td css={{ whiteSpace: "pre-wrap" }}>
                    {b.ignore.split(";").join("\n")}
                  </Td>
                  <Td>
                    <Wether yes={!b.disabled} />
                  </Td>

                  <Td>
                    <HStack spacing="$2">
                      <Button
                        onClick={() => {
                          to(`/@manage/backup/edit/${b.id}`)
                        }}
                      >
                        {t("global.edit")}
                      </Button>
                      <Button
                        onClick={() => {
                          to(`/@manage/backup/files/${b.id}`)
                        }}
                      >
                        {t("auto_backup.file_list")}
                      </Button>

                      <DeletePopover
                        name={b.src}
                        loading={deleting() === b.id}
                        onClick={async () => {
                          const resp = await deleteBackup(b.id)
                          handleResp(resp, () => {
                            notify.success(t("global.delete_success"))
                            refresh()
                          })
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              )}
            </For>
          </Tbody>
        </Table>
      </Box>
    </VStack>
  )
}

export default Backup
