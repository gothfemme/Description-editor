import { CellContent, DescriptionLine, LinesContent } from '@components/itemPopup/provider/providerInterfaces'
import { selfContainedArr, wrappers } from '@data/randomData'

export function convertLinesContent(line: string, tiles: { [key: string]: DescriptionLine[] }) {
   const splittedLine = line.split(/(<.+?\/>|🡅)/g).filter((line) => line !== '')
   return splittedLine.reduce((acc, text) => {
      if (text === '🡅') {
         acc.push({
            text: '🡅',
            classNames: ['enhancedArrow']
         })
         return acc
      }

      // if there are no special stuff return text
      if (text.match(/<.+?\/>/) === null) {
         acc.push({
            text
         })
         return acc
      }

      const wrappersName = text.match(/<\w+/)?.[0].replace('<', '')
      if (!wrappersName) return acc

      // wrapper with text inside
      if (wrappers.textEffecting.includes(wrappersName)) {
         acc.push({
            text: text.replace(new RegExp(`<${wrappersName} | \/>`, 'g'), ''),
            classNames: [wrappersName]
         })
         return acc
      }

      // wrapper with out text inside
      if (selfContainedArr.includes(wrappersName)) {
         acc.push({
            classNames: [wrappersName]
         })
         return acc
      }

      if (!wrappers.complicated.includes(wrappersName)) return acc

      const wrapperContent = text.match(/\[.+\]/)?.[0].replace(/\[|\]/g, '')
      const wrapperText = text.replace(/ \[.+\] \/>/g, '')

      if (!wrapperContent || !wrapperText) return acc

      if (wrappersName === 'link') {
         acc.push({
            text: wrapperText.replace('<link ', ''),
            link: wrapperContent,
            classNames: ['link']
         })
         return acc
      }
      if (wrappersName === 'formula') {
         acc.push({
            text: wrapperText.replace(/<formula ?/, ''),
            formula: wrapperContent,
            classNames: ['formula']
         })
         return acc
      }
      if (wrappersName === 'title') {
         acc.push({
            text: wrapperText.replace('<title ', ''),
            title: tiles[wrapperContent],
            classNames: ['title']
         })
         return acc
      }

      return acc
   }, [] as LinesContent[] | CellContent[])
}
