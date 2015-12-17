/**
 * Autor Nikolai Khilkovsky
 * Email: khilkovn@gmail.com
 * Github: https://github.com/nikkoUA
 *
 * @todo: Add best result saving and showing
 */

"use strict";

/**
 * Main App module
 *
 * @type module
 */
var findPairApp = angular.module('findPairApp', []);

/**
 * Cards list for game
 *
 * @type Array
 */
findPairApp.constant('cardsList', ["\ue077", '\ue002', '\ue018', '\ue031', '\ue034', '\ue045', '\ue060', '\ue104', '\ue123']);

/**
 * Default game time in seconds
 *
 * @type Number
 */
findPairApp.constant('gameTime', 180);

/**
 * Opened card
 *
 * @type Object
 */
findPairApp.value('game', {
    cardOpened: {},
    cardLeft: 0,
    gameRun: false,
    gamePause: false,
    timeLeft: 0,
    result: null,
    lose: null
});

/**
 * Directive game-timer. Format and show timer
 */
findPairApp.directive('gameTimer', function(){
    return function(scope, element, attrs){
        /**
         * Function Update timer view
         *
         * @param value {Number} - timer value
         */
        function updateTimer(value) {
            var time2show, min, sec;
            if(!value){
                time2show = '00:00';
            }
            else{
                min = Math.floor(value / 60);
                sec = value - min * 60;
                min = min.toString();
                sec = sec.toString();
                time2show = (min.length < 2 ? '0' : '') + min + ':';
                time2show += (sec.length < 2 ? '0' : '') + sec;
            }
            element.text(time2show);
        }

        scope.$watch(attrs.gameTimer, function(value) {
            updateTimer(value);
        });
    }
});

/**
 * Service for work with cards
 *
 * @param $rootScope {Object}
 * @param game {Object} - value.game
 * @param gameProcess {Object} - service.gameProcess
 * @return Object
 */
findPairApp.service('cards', ['$rootScope', 'game', 'gameProcess', function ($rootScope, game, gameProcess) {
    return {
        /**
         * Function create cards for game
         *
         * @param cardsList {Array}
         * @returns {Array}
         */
        list: function(cardsList){
            var result = [],
                cardsForGame = cardsList.concat(cardsList);

            cardsForGame.sort(function(){
                return Math.random() - 0.5;
            });
            for (var i = 0; i < cardsForGame.length; i++){
                result.push({
                    value: cardsForGame[i],
                    className: ''
                });
            }
            return result;
        },

        /**
         * Event listener of card click. Show card content, check for previous card, hide cards
         *
         * @param cardClicked {Object} - clicked card object
         */
        cardClick: function(cardClicked){
            if (cardClicked.className === 'open' || cardClicked.className === 'hide' || game.gamePause){
                return false;
            }
            cardClicked.className = 'open';
            if (game.cardOpened.value && game.cardOpened.value == cardClicked.value){
                cardClicked.className = 'found';
                game.cardOpened.className = 'found';
                game.cardLeft--;
                game.cardOpened = {};
                if(!game.cardLeft){
                    gameProcess.win();
                }
            }
            else {
                game.cardOpened.className = '';
                game.cardOpened = cardClicked;
            }
        }
    };
}]);

/**
 * Service Timer
 *
 * @param $window {Object}
 * @param $rootScope {Object}
 * @param game {object} - value.game
 * @param gameProcess {Object} - service.gameProcess
 * @return Object
 */
findPairApp.service('timer', ['$window', '$rootScope', 'game', 'gameProcess', function ($window, $rootScope, game, gameProcess) {
    return {
        /**
         * Function start game timer
         */
        start: function(){
            var self = this;
            $window.setTimeout(function(){
                if (game.gameRun){
                    game.timeLeft--;
                    if (game.timeLeft > 0 && !game.gamePause){
                        self.start();
                    }
                    else if(game.timeLeft <= 0) {
                        self.stop();
                        gameProcess.lose();
                    }
                    $rootScope.$digest();
                }
            }, 1000);
        },

        /**
         * Function pause game timer
         *
         * return {string} - class name for pause button
         */
        pause: function(){
            var self = this;
            game.gamePause = !game.gamePause;
            if(!game.gamePause){
                self.start();
            }
            return game.gamePause ? 'in-pause' : null;
        },

        /**
         * Function stop game timer
         */
        stop: function(){
            game.gameRun = false;
            game.gamePause = false;
        }
    };
}]);

/**
 * Service Game process
 *
 * @param gameTime {Number} - constant.gameTime
 * @param game {object} - value.game
 */
findPairApp.service('gameProcess', ['gameTime', 'game', function(gameTime, game){
    return {
        win: function(){
            game.result = gameTime - game.timeLeft;
            game.gameRun = false;
        },
        lose: function(){
            game.lose = true;
        }
    };
}]);

/**
 * Main app controller
 *
 * @param $scope {Object}
 * @param cardsList {Array} - constant.cardsList
 * @param gameTime {Number} - constant.gameTime
 * @param game {object} - value.game
 * @param cards {Function} - service.cards
 * @param timer {Function} - service.timer
 */
findPairApp.controller('findPairCtrl', ['$scope', 'cardsList', 'gameTime', 'game', 'cards', 'timer', function ($scope, cardsList, gameTime, game, cards, timer) {
    $scope.game = game;
    game.timeLeft = gameTime;

    $scope.startGame = function(){
        game.gameRun = true;
        game.cardLeft = cardsList.length;
        game.timeLeft = gameTime;
        game.result = null;
        game.lose = null;
        $scope.cards = cards.list(cardsList);
        $scope.timeLeft = game.timeLeft;
        $scope.hideStartBtn = true;
        $scope.inPause = null;
        timer.start();
    };
    $scope.pauseGame = function(){
        $scope.inPause = timer.pause();
    };
    $scope.stopGame = function(){
        timer.stop();
    };

    $scope.check = cards.cardClick;

    $scope.$watch(function(){
        return game.gameRun;
    }, function(newVal){
        if(!newVal){
            $scope.hideStartBtn = false;
            $scope.cards = [];
            if (game.timeLeft && game.result === null){
                game.timeLeft = gameTime;
            }
        }
    });
    $scope.activeClassName = 'game-run';
}]);
