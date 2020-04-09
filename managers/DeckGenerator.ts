import AllergyCard from './cards/AllergyCard';
import AnnaCard from './cards/AnnaCard';
import CartellPassCard from './cards/CartellPassCard';
import DieHardCard from './cards/DieHardCard';
import FactoryCard from './cards/FactoryCard';
import ForgetNameCard from './cards/ForgetNameCard';
import GoToTheGardenCard from './cards/GoToTheGardenCard';
import HepatitisCard from './cards/HepatitisCard';
import KDCard from './cards/KDCard';
import KolbICECard from './cards/KolbICECard';
import NameDayCard from './cards/NameDayCard';
import NotYouCard from './cards/NotYouCard';
import NoziCard from './cards/NoziCard';
import ThiefCard from './cards/ThiefCard';
import WhatsUpCopCard from './cards/WhatsUpCopCard';
import Card from './Card';

let cards = [
    new AllergyCard(),
    new AnnaCard(),
    new CartellPassCard(),
    new DieHardCard(),
    new FactoryCard(),
    new ForgetNameCard(),
    new GoToTheGardenCard(),
    new HepatitisCard(),
    new KDCard(),
    new KolbICECard(),
    new NotYouCard(),
    new NameDayCard(),
    new NoziCard(),
    new ThiefCard(),
    new WhatsUpCopCard()
];

export let defaultCardSet: Array<{ id: number, num: number }> = [
    {
        id: 1,
        num: 2
    },
    {
        id: 3,
        num: 2
    },
    {
        id: 4,
        num: 4
    },
    {
        id: 5,
        num: 1,
    },
    {
        id: 6,
        num: 1
    },
    {
        id: 7,
        num: 2,
    },
    {
        id: 8,
        num: 4
    },
    {
        id: 9,
        num: 2
    },
    {
        id: 10,
        num: 1,
    },
    {
        id: 11,
        num: 2
    },
    {
        id: 12,
        num: 1
    },
    {
        id: 13,
        num: 3
    },
    {
        id: 14,
        num: 1
    },
    {
        id: 15,
        num: 1
    },
    {
        id: 16,
        num: 2
    },
    {
        id: 17,
        num: 3
    },
    {
        id: 18,
        num: 2
    },
    {
        id: 19,
        num: 1
    }
]

export default class DeckGenerator {
    deck: Array<Card> = new Array<Card>();

    generate(input: Array<{ id: number, num: number }>, shuffle: boolean = true, numberOfPlayers: number) {
        var obj = this;

        input.push({
            id: 2,
            num: numberOfPlayers + 1
        });

        if (numberOfPlayers >= 5) {
            input.push({
                id: 20,
                num: 1
            })
        }

        input.forEach(function (elem) {
            if (elem.id == 20 && numberOfPlayers < 5) return;
            cards.forEach(function (card) {
                if (card.cardId === elem.id) {
                    for (let i = 0; i < elem.num; i++) {
                        obj.deck.push(card)
                    }
                }
            })
        })

        if(shuffle){            
            function shuffleMethod(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }

            shuffleMethod(obj.deck);
        }
        
        return obj.deck;
    }
}