import { World } from 'mojang-minecraft';

interface schedule {
    callback: Function,
    tick: number,
    args: Array<any>
}
const tickTimeoutMap: Map<number, schedule> = new Map();
const tickIntervalMap: Map<number, schedule> = new Map();
let tickTimeoutID = 0, tickIntervalID = 0;

/**
 * Delay executing a function
 * @typedef
 * @param {string | Function} handler Function you want to execute
 * @param {number} [timeout] Time delay in ticks. 20 ticks is 1 second
 * @param {any[]} args Function parameters for your handler
 * @returns {number}
 */
function setTickTimeout(handler: Function, timeout?: number, ...args: any[]): number {
    const tickTimeout = { callback: handler, tick: timeout, args };
    tickTimeoutID++;
    tickTimeoutMap.set(tickTimeoutID, tickTimeout);
    return tickTimeoutID;
};
/**
 * Delay executing a function, REPEATEDLY
 * @typedef
 * @param {Function} handler Function you want to execute
 * @param {number} [timeout] Time delay in ticks. 20 ticks is 1 second
 * @param {any[]} args Function parameters for your handler
 * @returns {number}
 */
function setTickInterval(handler: Function, timeout?: number, ...args: any[]): number {
    const tickInterval = { callback: handler, tick: timeout, args };
    tickIntervalID++;
    tickIntervalMap.set(tickIntervalID, tickInterval);
    return tickIntervalID;
};
/**
 * Delete a clearTickTimeout
 * @typedef
 * @param {number} handle Index you want to delete
 */
function clearTickTimeout(handle: number): void {
    tickTimeoutMap.delete(handle);
};
/**
 * Delete a clearTickInterval
 * @typedef
 * @param {number} handle Index you want to delete
 */
function clearTickInterval(handle: number): void {
    tickIntervalMap.delete(handle);
};

World.events.tick.subscribe((data) => {
    for(const [ID, tickTimeout] of tickTimeoutMap) {
        tickTimeout.tick--;
        if(tickTimeout.tick <= 0) {
            tickTimeout.callback(...tickTimeout.args);
            tickTimeoutMap.delete(ID);
        };
    };
    for(const [, tickInterval] of tickIntervalMap) {
        if(data.currentTick % tickInterval.tick === 0) tickInterval.callback(...tickInterval.args);
    };
});

export { setTickTimeout, setTickInterval, clearTickTimeout, clearTickInterval };
