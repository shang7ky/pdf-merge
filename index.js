#!/usr/bin/env node

/**
 * 合并多个PDF为一个PDF文件
 * 这个是使用的pdf-lib 对PDF进行合并
 */
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const lodash = require('lodash');

const readPDF = () => {
  const files = fs.readdirSync('.');
  const list = files.filter(item => item.match(/\.pdf$/))
  
  // 按创建时间排序
  // lodash.sortBy(
  //   list, 
  //   (o) => {
  //     const stats = fs.statSync(`./${o}`)
  //     return stats.birthtimeMs
  //   }
  // )
  // 按名称排序
  // lodash.sortBy(
  //   list,
  //   function(o) { 
  //     return o.replace('.pdf', '');
  //   }
  // )

  return lodash.sortBy(list, function(o) { return o.replace('.pdf', ''); })
}


const mergePDF = async ({ sourceFiles, outputFile }) => {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < sourceFiles.length; i += 1) {
    const localPath = `./${sourceFiles[i]}`;
    const PDFItem = await PDFDocument.load(fs.readFileSync(localPath));

    for (let j = 0;j < PDFItem.getPageCount(); j += 1) {
      const [PDFPageItem] = await pdfDoc.copyPages(PDFItem, [j]);
      pdfDoc.addPage(PDFPageItem);
    }
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFile || 'merge.pdf', pdfBytes);
};

const sourceFiles = readPDF();
mergePDF({ sourceFiles });

