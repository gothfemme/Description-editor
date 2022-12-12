import { Languages } from '@redux/interfaces'
import { store } from '@redux/store'

export function getVariables(description: string) {
   const variables = description.match(/^var [A-z0-9]+ = .+$/gm)

   if (variables === null) return
   return variables.reduce((acc, variableText) => {
      const varName = variableText.match(/(?<=var )[A-z0-9]+(?= = )/)?.[0].trim()
      const varValue = variableText.match(/(?<=var [A-z0-9]+ = ).+/)?.[0].trim()
      if (!varName || !varValue) return acc

      if (varValue === 'empty') {
         acc[varName] = ''
         return acc
      }
      acc[varName] = varValue
      return acc
   }, {} as { [key: string]: string })
}

export function loadVariables(description: string, language: Languages): string {
   const database = store.getState().global.database

   const getVariablesNames = (description: string) => {
      return description.match(/#[A-z0-9]+/g) || []
   }

   const replaceVariables = (variablesInDescription: string[]) => {
      variablesInDescription.forEach((variableName) => {
         const cleanVariableName = variableName.replace('#', '')
         const variables = {
            ...getVariables(description),
            ...getVariables(database[2].editor[language]?.main || ''),
            ...getVariables(database[2].editor[language]?.secondary || '')
         }
         if (variables[cleanVariableName] === undefined) return
         description = description.replaceAll(variableName, variables[cleanVariableName])
      })
   }

   replaceVariables(getVariablesNames(description))

   return description
}
