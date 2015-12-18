/**
 * Autor Nikolai Khilkovsky
 * Email: khilkovn@gmail.com
 * Github: https://github.com/nikkoUA
 */

'use strict';

describe('findPairApp', function (){
    var startButton, stopButton, pauseButton, timer, gameCards;

    beforeEach(function (){
        browser.get('/');
        browser.waitForAngular();
        pauseButton = $$('#game .controlls button').first();
        startButton = $$('#game .controlls button').get(1);
        stopButton = $$('#game .controlls button').last();
        timer = $$('#game .controlls time').first();
    });

    describe('Controllers block', function (){

        it('Should "03:00" time in timer', function (){
            expect(timer.getText()).toBe('03:00');
        });

        it('Should be visible only startButton', function (){
            expect(pauseButton.getCssValue('visibility')).toBe('hidden');
            expect(pauseButton.getCssValue('display')).toBe('block');
            expect(startButton.getCssValue('display')).toBe('inline-block');
            expect(stopButton.getCssValue('display')).toBe('none');
        });

        it('Should be visible only stopButton and pauseButton then only startButton', function (){
            startButton.click();
            browser.waitForAngular();
            expect(pauseButton.getCssValue('visibility')).toBe('visible');
            expect(pauseButton.getCssValue('display')).toBe('block');
            expect(startButton.getCssValue('display')).toBe('none');
            expect(stopButton.getCssValue('display')).toBe('inline-block');
            stopButton.click();
            browser.waitForAngular();
            expect(pauseButton.getCssValue('visibility')).toBe('hidden');
            expect(pauseButton.getCssValue('display')).toBe('block');
            expect(startButton.getCssValue('display')).toBe('inline-block');
            expect(stopButton.getCssValue('display')).toBe('none');
        });

        it('Should pause and resume game', function (){
            console.log('Pause and resume game test start. Wait for 10 sec.');
            startButton.click();
            browser.waitForAngular();
            browser.sleep(5100).then(function (){
                pauseButton.click();
                browser.waitForAngular();
                expect(timer.getText()).toBe('02:55');
                expect($('.message.pause').getCssValue('display')).toBe('block');
                expect(element.all(by.repeater('card in cards')).count()).toBe(18);
                pauseButton.click();
                browser.waitForAngular();
                browser.sleep(5100).then(function (){
                    browser.waitForAngular();
                    expect(timer.getText()).toBe('02:50');
                    expect($('.message.pause').getCssValue('display')).toBe('none');
                    expect(element.all(by.repeater('card in cards')).count()).toBe(18);
                });
            });
        });

        it('Check timer', function (){
            console.log('Check timer start. Wait for 1 min.');
            startButton.click();
            browser.waitForAngular();
            browser.sleep(60100).then(function (){
                expect(timer.getText()).toBe('02:00');
            });
        });
    });

    describe('Game process', function (){

        it('Should create and remove 18 cards', function (){
            expect(element.all(by.repeater('card in cards')).count()).toBe(0);
            startButton.click();
            browser.waitForAngular();
            expect(element.all(by.repeater('card in cards')).count()).toBe(18);
            stopButton.click();
            browser.waitForAngular();
            expect(element.all(by.repeater('card in cards')).count()).toBe(0);
        });

        it('Should show clicked card', function (){
            startButton.click();
            browser.waitForAngular();
            gameCards = element.all(by.repeater('card in cards'));
            gameCards.each(function (elm){
                elm.click();
                browser.waitForAngular();
                expect(elm.getAttribute('class')).toMatch(/(open)|(found)/g);
            });
        });

        it('Should win the game', function (){
            var variant = [];
            startButton.click();
            browser.waitForAngular();
            gameCards = element.all(by.repeater('card in cards'));
            gameCards.each(function (elm, idx){
                elm.getText().then(function (a){
                    variant.push({
                        value: a,
                        index: idx
                    });
                });
            }).then(function (){
                variant.sort(function (a, b){
                    if (a.value > b.value){
                        return 1;
                    }
                    else if (a.value < b.value){
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
                for (var idx = 0; idx < variant.length; idx++){
                    gameCards.get(variant[idx].index).click();
                }
                browser.waitForAngular();
                expect($('.message.win').getCssValue('display')).toBe('block');
                expect(element.all(by.repeater('card in cards')).count()).toBe(0);
            });
        });

        it('Should lose the game', function (){
            console.log('Lose the game test start. Wait for 3 min.');
            startButton.click();
            browser.sleep(185000).then(function (){
                browser.waitForAngular();
                expect($('.message.lose').getCssValue('display')).toBe('block');
                expect(element.all(by.repeater('card in cards')).count()).toBe(0);
            });
        });
    });
});
