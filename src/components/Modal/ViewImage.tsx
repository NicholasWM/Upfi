import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Text
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="pGray.800" h="auto" w="auto" maxH="600px" maxW="900px">
          <ModalBody padding='0'>
            <Image src={imgUrl}/>
          </ModalBody>

          <ModalFooter  justifyContent="left" >
            <Link isExternal href={imgUrl}>
              Abrir original
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
