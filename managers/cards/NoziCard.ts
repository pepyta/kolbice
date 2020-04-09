import Card from "../Card";

export default class NoziCard extends Card {
    constructor(){
        super(18, false);
        this.noziCard = true;
        this.name = "Nózi";
    }

    use(){}
}