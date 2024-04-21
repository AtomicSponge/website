/**
 * 
 * @author Matthew Evans
 * @module atomicsponge.website
 * @copyright MIT see LICENSE.md
 * 
 */

import { TermError } from './TermError.js'

export class TermRenderer {
  /** Flag if the renderer was initialized */
  static #initialized:boolean = false
  /** Flag if the renderer is ready to run */
  static #ready:boolean = false
  /** Reference to the canvas ID */
  static #canvas_name:string = '___termrenderer_canvas_id'
  /** Reference to the canvas element */
  static #canvas:HTMLCanvasElement
  /** Reference to the drawing context */
  static #ctx:CanvasRenderingContext2D
  /** Reference to the rendering process */
  static #renderProc:number
  /** Rendering function */
  static #renderFunc:FrameRequestCallback

  constructor() { return false }  //  Don't allow direct construction

  /** Set up the TermRenderer */
  static initialize = () => {
    //  Append canvas css styling
    const cssElem = document.createElement('style')
    cssElem.innerHTML = `
      #${TermRenderer.#canvas_name} {
        pointer-events: none;
        position: fixed;
        display: none;
        margin: 0;
        padding: 0;
        background-color: rgba(0, 0, 0, 0.66);
      }`
    document.body.appendChild(cssElem)

    //  Prepend canvas html
    const canvas = document.createElement('canvas')
    canvas.setAttribute('id', TermRenderer.#canvas_name)
    canvas.setAttribute('width', `${document.documentElement.clientWidth}`)
    canvas.setAttribute('height', `${document.documentElement.clientHeight}`)
    document.body.prepend(canvas)

    TermRenderer.#canvas = <HTMLCanvasElement>document.getElementById(TermRenderer.#canvas_name)
    TermRenderer.#ctx = <CanvasRenderingContext2D>TermRenderer.#canvas.getContext("2d")
    TermRenderer.#renderProc == 0

    const observer = new ResizeObserver(() => {
      TermRenderer.#canvas.width = document.documentElement.clientWidth
      TermRenderer.#canvas.height = document.documentElement.clientHeight
    })
    observer.observe(document.documentElement)

    TermRenderer.#initialized = true
  }

  /**
   * Set the renderer's animation function
   * @param func Animation function
   */
  static setRenderer = (func:FrameRequestCallback) => {
    if(!(func instanceof Function))
      throw new TermError('Not a function!', TermRenderer.setRenderer)
    TermRenderer.#renderFunc = func
    TermRenderer.#ready = true
  }

  /** Start the renderer */
  static start = () => {
    if(!TermRenderer.isReady)
      throw new TermError('TermRender not ready!  Was it properly configured?', TermRenderer.start)
    if(TermRenderer.isRunning) TermRenderer.stop()
    TermRenderer.show()
    TermRenderer.#renderProc = window.requestAnimationFrame(TermRenderer.#renderFunc)
  }

  /** Stop the renderer */
  static stop = () => {
    TermRenderer.hide()
    window.cancelAnimationFrame(TermRenderer.#renderProc)
    TermRenderer.#renderProc = 0
  }

  /** Show the renderer */
  static show = () => {
    Object.assign(TermRenderer.#canvas, { display: 'block' })
  }

  /** Hide the renderer */
  static hide = () => {
    Object.assign(TermRenderer.#canvas, { display: 'none' })
  }

  /**
   * Check if the renderer is ready to start
   * This requires both initilization to be ran and a render function to be set
   * @returns If the renderer is ready to run
   */
  static get isReady():boolean {
    return TermRenderer.#initialized && TermRenderer.#ready
  }

  /**
   * Check if the renderer is running
   * @retunrs True if it is, false if not
   */
  static get isRunning():boolean {
    if(TermRenderer.#renderProc === 0) return false
    return true
  }

  /**
   * Get the renderer's drawing context
   * @retunrs The drawing context
   */
  static get draw():CanvasRenderingContext2D { return TermRenderer.#ctx }

  /**
   * Get the renderer's width
   * @retunrs Width in pixels
   */
  static get width():number { return TermRenderer.#canvas.width }

  /**
   * Get the renderer's height
   * @retunrs Height in pixels
   */
  static get height():number { return TermRenderer.#canvas.height }

  /**
   * Set the renderer's color
   * @param color Color code in hex, rgb(a) or hsl(a)
   */
  static set bgColor(color:string) {
    if(!TermRenderer.#testHex(color) || !TermRenderer.#testRgb(color))
      throw new TermError('Not a valid color code!', TermRenderer.bgColor)
    Object.assign(TermRenderer.#canvas, { backgroundColor: color })
  }

  /**
   * Regex that tests for hex
   * @param str String to test
   * @returns True if valid, else false
   */
  static #testHex(str:string):boolean {
    return /^#[0-9a-f]{3,4}([0-9a-f]{3,4})?$/i.test(str)
  }

  /**
   * Regex that tests for rgb(a) or hsl(a)
   * @param str String to test
   * @returns True if valid, else false
   */
  static #testRgb(str:string):boolean {
    return /^(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\)$/i.test(str)
  }
}