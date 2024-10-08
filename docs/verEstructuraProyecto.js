const fs = require('fs');
const path = require('path');

// Lista de carpetas a excluir
const excludedFolders = ['.git', 'node_modules'];

function getDirectoryStructure(dir, indent = '|') {
  let result = '';

  const items = fs.readdirSync(dir);
  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);

    // Excluir carpetas no deseadas
    if (excludedFolders.includes(item)) {
      return;
    }

    const isLast = index === items.length - 1;
    const symbol = isLast ? '└──' : '├──';
    result += `${indent}${symbol} ${item}\n`;

    if (fs.statSync(fullPath).isDirectory()) {
      const newIndent = indent + (isLast ? '    ' : '|   ');
      result += getDirectoryStructure(fullPath, newIndent);
    }
  });

  return result;
}

// Cambia esta ruta por la que quieras escanear
const directoryPath = './tsinventario';
const outputFilePath = './directory_structure.txt'; // Archivo de salida

// Obtiene la estructura del directorio
const directoryStructure = getDirectoryStructure(directoryPath);

// Guarda el resultado en un archivo de texto
fs.writeFileSync(outputFilePath, directoryStructure, 'utf-8');

console.log(`Estructura guardada en: ${outputFilePath}`);



