// Central GSAP setup: registers plugins and the custom eases used across the
// monochrome animations so every component shares them.
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

// Signature eases from the design source.
if (!CustomEase.get('hop')) CustomEase.create('hop', '.15, 1, .25, 1')
if (!CustomEase.get('hop2')) CustomEase.create('hop2', '.9, 0, .1, 1')

export { gsap }
