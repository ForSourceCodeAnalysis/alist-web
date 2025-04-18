import { useFetch, useManageTitle, useRouter, useT } from "~/hooks"
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
  VStack,
} from "@hope-ui/solid"
import { AutoBackupLog, PPageResp, PEmptyResp } from "~/types"
import { handleResp, r } from "~/utils"
import { MaybeLoading } from "~/components"
import { createSignal, For } from "solid-js"
const BackupLog = () => {
  const t = useT()
  useManageTitle("auto_backup.file_list")
  const { params } = useRouter()
  const { id } = params
  const [logs, setLogs] = createSignal<AutoBackupLog[]>([])
  const [loading, getLogs] = useFetch(
    (): PPageResp<AutoBackupLog> =>
      r.get(
        `/admin/backup/files/${id}?page=${currentPage()}&page_size=${pageSize()}`,
      ),
  )

  const [currentPage, setCurrentPage] = createSignal(1)
  const [pageSize, setPageSize] = createSignal(50)
  const [total, setTotal] = createSignal(0)

  const refresh = async () => {
    const resp = await getLogs()
    handleResp(resp, (data) => {
      setLogs(resp.data.content)
      setTotal(resp.data.total)
    })
  }
  refresh()

  return (
    <MaybeLoading loading={loading()}>
      <VStack spacing="$2" alignItems="start" w="$full">
        <HStack spacing="$2">
          <Button colorScheme="accent" onClick={refresh}>
            {t("global.refresh")}
          </Button>
        </HStack>

        <Box w="$full" overflowX="auto">
          <Table highlightOnHover dense>
            <Thead>
              <Tr>
                <Th>{t("auto_backup.src_dir")}</Th>
                <Th>{t("auto_backup.filename")}</Th>
                <Th>{t("auto_backup.last_backup")}</Th>
                <Th>{t("auto_backup.time_consuming")}</Th>
                <Th>{t("auto_backup.first_backup")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <For each={logs()}>
                {(log) => (
                  <Tr>
                    <Td>{log.dir}</Td>
                    <Td>{log.name}</Td>
                    <Td>{new Date(log.last_modified_time).toLocaleString()}</Td>
                    <Td>{log.time_consuming}</Td>
                    <Td>{new Date(log.created_at).toLocaleString()}</Td>
                  </Tr>
                )}
              </For>
            </Tbody>
          </Table>
        </Box>
        <HStack justifyContent="flex-end" mt="$4" w="$full" spacing="$2">
          <Button
            disabled={currentPage() === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            {"<"}
          </Button>
          <Box>
            {currentPage()} / {Math.ceil(total() / pageSize())}
          </Box>
          <Button
            disabled={currentPage() >= Math.ceil(total() / pageSize())}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {">"}
          </Button>
        </HStack>
      </VStack>
    </MaybeLoading>
  )
}

export default BackupLog
