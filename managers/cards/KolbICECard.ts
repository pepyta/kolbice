import Card from '../Card';
import { MapSchema } from '@colyseus/schema';
import Player from '../Player';

export default class KolbICECard extends Card {
    constructor(){
        super(2, false);
        this.kolbiceCard = true;
        this.name = "Kolbász";
    }

    use(){}
}