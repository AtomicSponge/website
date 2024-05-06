/**
 * 
 * @author Matthew Evans
 * @module atomicsponge.website
 * @copyright MIT see LICENSE.md
 * 
 */

import { Command } from './Command.js'
import { renderText } from '../extras/renderText.js'

import aboutMarkdown from '../assets/markdown/about.md?raw'

export class AboutCmd extends Command {
  /**
   * Initialize 
   */
  constructor() {
    super()
    this.command = 'about'
    this.description = 'About this website'
  }

  /**
   * Process command
   * @param args 
   * @returns 
   */
  async exec():Promise<string> {
    return renderText(aboutMarkdown)
  }
}