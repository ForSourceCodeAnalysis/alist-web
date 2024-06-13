import { Anchor, HStack, VStack } from "@hope-ui/solid"

const Beian = () => {
  return (
    <VStack class="footer" w="$full" py="$4">
      <HStack spacing="$1">
        <Anchor href="https://www.beian.gov.cn" external>
          粤ICP备2021027476号-1
        </Anchor>
      </HStack>
    </VStack>
  )
}
export { Beian }
