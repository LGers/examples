import { Position } from './types';

class MovePoint {
  private _distanceToStop(speed: number): number {
    let dist = speed;
    if (speed > 0) dist += this._distanceToStop(--speed);
    return dist;
  }

  /**
   *
   * @param from angle
   * @param to angle
   * @param speed points/time
   */
  rotateTo(from: number, to: number, speed: number): number[] {
    return this._slowStartSlowStop(to - from, speed).map((el) => el.currentPosition + from);
  }

  /**
   *
   * @param from [x, y]
   * @param to [x,y]
   * @param duration time in ms
   * @param speed points/time
   */
  private _moveToOld(from: [x: number, y: number], to: [x: number, y: number], speed: number) {
    const distance = Math.ceil(Math.sqrt((from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2));
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const atan = Math.atan2(dy, dx)
    const distanceSteps: Position[] = this._slowStartSlowStop(distance, speed);

    return distanceSteps.map((el) => {
      const x = from[0] + Math.floor(el.currentPosition * Math.cos(atan));
      const y = from[1] + Math.floor(el.currentPosition * Math.sin(atan));
      return [x, y];
    });
  }

  moveTo2d(from: [x: number, y: number, z: number], to: [x: number, y: number, z: number], speed: number) {
    const distance = Math.ceil(Math.sqrt((from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2));

    if (!distance) return [0, 0, 0];
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const distanceSteps: Position[] = this._slowStartSlowStop(distance, speed);

    return distanceSteps.map((el) => {
      const x = from[0] + dx / distance * el.currentPosition;
      const y = from[1] + dy / distance * el.currentPosition;
      return [x, y];
    });
  }

  /**
   *
   * @param from
   * @param to
   * @param speed
   */
  moveTo3d(from: [x: number, y: number, z?: number], to: [x: number, y: number, z?: number], speed: number) {
    const distance2d = this._getDistance2d(from[0] - to[0], + from[1] - to[1]);
    const is3d = from[2] && to[2];
    const distance = is3d ? this._getDistance2d(distance2d, from[2] - to[2]) : distance2d;

    if (!distance) return [0, 0, 0];

    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const dz = to[2] - from[2];
    const distanceSteps: Position[] = this._slowStartSlowStop(distance, speed);

    return distanceSteps.map((el) => {
      const x = from[0] + Math.ceil(dx / distance * el.currentPosition);
      const y = from[1] + Math.ceil(dy / distance * el.currentPosition);
      const z = from[2] + Math.ceil(dz / distance * el.currentPosition);
      if (is3d) {
        return [x, y, z]
      } else return [x, y];
    });
  }

  private _getDistance2d(x: number, y: number): number {
    return Math.ceil(Math.sqrt(x ** 2 + y ** 2));
  }

  /**
   * Boost on start. No braking on finish
   * return Array of Positions{currentSpeed, currentDistance}
   * @param distance
   * @param speed
   */
  private _slowStartHardStop(distance: number, speed: number): Position[] {
    const steps: Position[] = [];
    let currentSpeed = 0;
    let currentPosition = 0;
    do {
      steps.push({ currentSpeed, currentPosition });
      if (currentSpeed + 1 < speed) {
        currentSpeed++;
      } else currentSpeed = speed;

      currentPosition += currentSpeed;
    } while (currentPosition < distance)

    if (currentPosition - currentSpeed < distance) steps.push({
      currentSpeed,
      currentPosition: distance
    });

    return steps;
  }

  /**
   * Boost on start. Braking on finish
   * return Array of Positions{currentSpeed, currentDistance}
   * @param distance
   * @param speed
   */
  private _slowStartSlowStop(distance: number, speed: number): Position[] {
    if (distance === 0) return [{ currentSpeed: 0, currentPosition: 0 }]
    const steps: Position[] = [];
    const distanceToStop = this._distanceToStop(speed);
    let currentSpeed = 0;
    let currentPosition = 0;

    const startDist: Position[] = [];
    const halfDistance = distance / 2;
    /** small distance **/
    if (distanceToStop > halfDistance) {
      let i = 0;
      do {
        startDist.push({ currentSpeed, currentPosition });
        i++;
        currentPosition += i;
        currentSpeed++
      } while (currentPosition < halfDistance - i);
      const endDist = startDist.map((el) => {
        return { currentSpeed: el.currentSpeed, currentPosition: distance - el.currentPosition }
      }).reverse();
      return [...startDist, ...endDist];
    }
    /** small distance **/

    do {
      steps.push({ currentSpeed, currentPosition });
      if (currentSpeed + 1 < speed) {
        currentSpeed++;
      } else currentSpeed = speed;

      currentPosition += currentSpeed;
    } while (currentPosition < distance - distanceToStop)

    do {
      steps.push({ currentSpeed, currentPosition });
      currentSpeed--
      currentPosition += currentSpeed;
    } while (currentSpeed > 0)

    if (currentPosition <= distance) steps.push({ currentSpeed, currentPosition: distance });
    return steps;
  }
}

const point = new MovePoint();

console.log(point.rotateTo(1, 50, 5));
console.log('steps', point.moveTo3d([0, -10], [0, 40],  5));
console.log('steps', point.moveTo3d([0, 0, -10], [0, 1, 100],  5));
console.log('steps', point.moveTo3d([0, -10], [0, 100],  50));
console.log('steps', point.moveTo3d([0, 0], [0, 100],  50));

console.log(point.rotateTo(-10, 100, 5))
