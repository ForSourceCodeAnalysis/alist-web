import { useManageTitle } from "~/hooks"
import { TypeTasks } from "./Tasks"

const Backup = () => {
  useManageTitle("manage.sidemenu.backup")
  return <TypeTasks type="backup" canRetry />
}

export default Backup
