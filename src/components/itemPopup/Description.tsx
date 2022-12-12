import { bungieStatNames } from '@data/randomData'
import { store } from '@redux/store'
import { useImmer } from 'use-immer'
import styles from './Description.module.scss'
import { DescriptionLine, LinesContent, RowContent } from './provider/providerInterfaces'

const calculateStat = (formula?: string) => {
   if (formula) {
      if (/range/i.test(formula)) {
         return ` ${Math.round(Math.random() * 100)}m`
      }
      return ` ${Math.round(Math.random() * 1000)}ms`
   }
}

const otherOptions = (linesContent: LinesContent) => {
   if (linesContent?.link) return <a href={linesContent.link}>{linesContent.text}</a>
   if (linesContent?.formula)
      return (
         <>
            {linesContent.text} {calculateStat(linesContent.formula)}
         </>
      )
   return null
}

const joinClassNames = (classNames: (string | null | undefined)[] | undefined) => {
   return classNames
      ?.flatMap((className: string | null | undefined) => {
         if (className === null || className === undefined) return []
         return styles[className]
      })
      .join(' ')
}

export function DescriptionBuilder({ description }: { description: DescriptionLine[] | string }): JSX.Element {
   const globalState = store.getState().global
   const selectedWeaponType = globalState.settings.weaponType
   const currentlySelected = globalState.settings.currentlySelected
   const selectedPerk = globalState.database[currentlySelected]

   const [hoverPopup, setHoverPopup] = useImmer<{ [key: string]: JSX.Element }>({})

   const buildLine = (description: DescriptionLine, i: number) =>
      (description.weaponTypes?.some((weaponType) => weaponType === selectedWeaponType) ||
         description.weaponTypes === undefined) && (
         <div className={joinClassNames(description.classNames)} key={i}>
            {description?.linesContent?.map((linesContent, i) => (
               <span className={joinClassNames(linesContent?.classNames)} key={i}>
                  {linesContent?.title ? (
                     <span
                        onMouseEnter={(e) => onHover(e, linesContent.title, linesContent.text)}
                        onMouseLeave={(e) => onHover(e, linesContent.title, linesContent.text)}
                     >
                        {linesContent.text && hoverPopup[linesContent.text]}
                        {linesContent?.text}
                     </span>
                  ) : (
                     otherOptions(linesContent) || linesContent?.text
                  )}
               </span>
            ))}
         </div>
      )

   const convertTableLine = (rowContent: RowContent, i: number) => (
      <td
         key={i}
         colSpan={rowContent.colSpan}
         rowSpan={rowContent.rowSpan}
         className={joinClassNames(rowContent?.classNames)}
      >
         {rowContent.cellContent?.map((cellContent, i) => (
            <span
               className={joinClassNames(cellContent?.classNames)}
               key={i}
               onMouseEnter={cellContent?.title ? (e) => onHover(e, cellContent.title, cellContent.text) : undefined}
               onMouseLeave={cellContent?.title ? (e) => onHover(e, cellContent.title, cellContent.text) : undefined}
            >
               {cellContent.text && hoverPopup[cellContent.text]}
               {otherOptions(cellContent) || cellContent?.text}
            </span>
         ))}
      </td>
   )

   const buildTable = (lineWithTable: DescriptionLine, i: number) => (
      <table className={joinClassNames(lineWithTable?.classNames)} key={i}>
         <tbody>
            {lineWithTable?.table?.map((tableLine, i) => (
               <tr className={joinClassNames(tableLine.classNames)} key={i}>
                  {tableLine?.rowContent?.map((rowContent, i) => convertTableLine(rowContent, i))}
               </tr>
            ))}
         </tbody>
      </table>
   )

   const buildDescription = (descriptionLines: DescriptionLine[]) => {
      if (!descriptionLines || descriptionLines.length === 0) return

      return descriptionLines.map((descriptionLine: DescriptionLine, i: number) =>
         descriptionLine?.table ? buildTable(descriptionLine, i) : buildLine(descriptionLine, i)
      )
   }

   function onHover(
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      title: DescriptionLine[] | undefined,
      name: string | undefined
   ) {
      if (!title || !name) return
      if (e.type === 'mouseenter') {
         setHoverPopup((draft) => {
            draft[name] = <div className={styles.titleContainer}>{buildDescription(title)}</div>
         })
      }
      if (e.type === 'mouseleave') {
         setHoverPopup((draft) => {
            draft[name] = <></>
         })
      }
   }

   const investmentStats = () => {
      const linkedStats =
         selectedPerk.type === 'weaponPerk' && selectedPerk.linkedWith
            ? globalState.database[selectedPerk.linkedWith]?.investmentStats
            : undefined

      const normalStats = selectedPerk.investmentStats

      if (!(linkedStats || normalStats)) return

      return (
         <div className={styles.investmentStats}>
            {normalStats?.map((stat, i) => (
               <div key={i}>
                  {stat.value > 0 ? `+${stat.value}` : `${stat.value}`} {bungieStatNames[stat.statTypeHash]}
               </div>
            ))}
            {linkedStats?.map((stat, i) => (
               <div key={i}>
                  {stat.value > 0 ? `+${stat.value}` : `${stat.value}`} {bungieStatNames[stat.statTypeHash]} {'>'} Will
                  show up on Enhanced only
               </div>
            ))}
         </div>
      )
   }

   if (typeof description === 'string') {
      return <div className={styles.description}>{description}</div>
   }

   return (
      <div className={styles.description}>
         {buildDescription(description)} {investmentStats()}
      </div>
   )
}
