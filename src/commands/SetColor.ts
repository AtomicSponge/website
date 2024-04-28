/**
 * 
 * @author Matthew Evans
 * @module atomicsponge.website
 * @copyright MIT see LICENSE.md
 * 
 */

import { Command } from './Command.js'

import setColorHelp from '../assets/markdown/setcolor_help.md?raw'

export class SetColor extends Command {
  /** Store the default background color */
  defaultBgColor:string = '#242424'
  /** Store the default foreground color */
  defaultFgColor:string = 'rgba(255, 255, 255, 0.87)'
  /** Store the initial background color */
  initialBgColor:string
  /** Store the initial foreground color */
  initialFgColor:string

  /**
   * Initialize SetColor
   */
  constructor() {
    super()
    this.command = 'setcolor'
    this.description = 'Set terminal colors'
    this.help = this.renderText(setColorHelp)

    this.#loadColors()
    this.initialBgColor = document.body.style.backgroundColor
    this.initialFgColor = document.body.style.color
  }

  /**
   * Process command
   * @param args 
   * @returns 
   */
  exec(args:Array<string>):string {
    var errMsg = 'See <span style=\"font-weight: bold;\">setcolor help</span> for more info.'
    switch(String(args[0]).toLowerCase()) {
      case 'help': return this.help
      case 'reset':
        this.#setBgColor(this.initialBgColor)
        this.#setFontColor(this.initialFgColor)
        return 'Colors reset.'
      case 'default':
        this.#setBgColor(this.defaultBgColor)
        this.#setFontColor(this.defaultFgColor)
        return 'Colors reset to default.'
      case 'save':
        if (this.#saveColors()) return 'Color settings saved.'
        return 'Error saving color settings!'
      case 'load':
        if(this.#loadColors()) return 'Color settings loaded.'
        return 'Error loading color settings!'
      case 'background':
        if(this.testHex(args[1]) || this.testRgb(args[1])) {
          this.#setBgColor(args[1])
          return 'Background color set.'
        }
        return 'Incorrect color code. ' + errMsg
      case 'font':
        if(this.testHex(args[1]) || this.testRgb(args[1])) {
          this.#setFontColor(args[1])
          return 'Font color set.'
        }
        return 'Incorrect color code. ' + errMsg
    }
    return this.help
  }

  /**
   * 
   * @param color 
   */
  #setBgColor(color:string) {
    document.body.style.backgroundColor = color
  }

  /**
   * 
   * @param color 
   */
  #setFontColor(color:string) {
    document.body.style.color = color
  }

  /**
   * Check if color settings exist locally
   * @returns 
   */
  #settingsExist():boolean {
    if(localStorage.getItem('bgcolor') === null) return false
    if(localStorage.getItem('fgcolor') === null) return false
    return true
  }

  /**
   * Save color settings to localstore
   * @returns 
   */
  #saveColors():boolean {
    localStorage.setItem('bgcolor', document.body.style.backgroundColor)
    localStorage.setItem('fgcolor', document.body.style.color)
    if(this.#settingsExist()) return true
    return false
  }

  /**
   * Load color settings from localstore
   * @returns 
   */
  #loadColors():boolean {
    if(this.#settingsExist()) {
      document.body.style.backgroundColor = <string>localStorage.getItem('bgcolor')
      document.body.style.color = <string>localStorage.getItem('fgcolor')
      return true
    }
    return false
  }
}