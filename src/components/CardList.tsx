import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const {isOpen, onClose, onOpen} = useDisclosure()
  // TODO SELECTED IMAGE URL STATE
  const [selectedUrl, setSelectedUrl] = useState('')
  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleSelectedImage(imageUrl: string){
    setSelectedUrl(imageUrl)
    onOpen()
  }

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid columns={3} spacing={"40px"}>
        {cards.map((card) => (
          <Card data={card} key={card.id} viewImage={()=>{handleSelectedImage(card.url)}}/>
        ))}
      </SimpleGrid>
      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage imgUrl={selectedUrl} isOpen={isOpen} onClose={onClose} />

    </>
  );
}
