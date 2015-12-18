/**
 * Autor Nikolai Khilkovsky
 * Email: khilkovn@gmail.com
 * Github: https://github.com/nikkoUA
 */

'use strict';

describe('FindPairApp services', function (){
    var cardsList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    // load modules
    beforeEach(module('findPairApp'));

    //result service
    describe('Service "cards"', function (){
        var result;

        beforeEach(function (){
            inject(function ($injector){
                result = $injector.get('cards');
            });
        });

        //list method
        it('should return card list with ' + cardsList.length * 2 + ' items', function (){
            expect(result.list(cardsList).length).toBe(cardsList.length * 2);
        });

        it('should return card list in random order', function (){
            var randomOrder = false;
            var resultCardsListVal = [];
            var resultCardsList = result.list(cardsList);
            var baseCargList = cardsList.concat(cardsList);
            for (var i = 0; i < resultCardsList.length; i++){
                resultCardsListVal.push(resultCardsList[i].value);
                if (resultCardsList[i].value != baseCargList[i]){
                    randomOrder = true;
                    break;
                }
            }
            expect(randomOrder).toBeTruthy();
        });
    });
});
