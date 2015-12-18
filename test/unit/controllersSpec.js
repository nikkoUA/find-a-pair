/**
 * Autor Nikolai Khilkovsky
 * Email: khilkovn@gmail.com
 * Github: https://github.com/nikkoUA
 */

'use strict';

describe('FindPairApp controllers', function (){
    describe('Controller "FindPairCtrl"', function (){
        var scope, ctrl;
        var gameTime = 180;

        beforeEach(module('findPairApp'));

        beforeEach(inject(function ($rootScope, $controller){
            scope = $rootScope.$new();
            ctrl = $controller('findPairCtrl', {$scope: scope});
        }));

        it('$scope.game must have default values', function (){
            expect(scope.game).toEqual({
                cardOpened: {},
                cardLeft: 0,
                gameRun: false,
                gamePause: false,
                timeLeft: gameTime,
                result: null,
                lose: null
            });
        });

        it('should add class "game-run" when game initialised', function (){
            expect(scope.activeClassName).toBe('game-run');
        });
    });
});
