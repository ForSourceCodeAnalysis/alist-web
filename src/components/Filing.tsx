import { Anchor } from "@hope-ui/solid"
import { getSetting } from "../store"

const Filing = () => {
  return (
    <Anchor
      href={getSetting("filing_url")}
      external
      color="$neutral10"
      style={{ margin: "10px" }}
    >
      {getSetting("filing_number")}
    </Anchor>
  )
}
export { Filing }
