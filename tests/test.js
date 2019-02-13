(($) => {
  const result = window.htmlTableToCSV({
    /* pass the element */
    tableElement: $('#table-example'),
    firstLineAsHeader: true,
    forceDownload: true,
    output: {
      separator: '|'
    }
  })
  
  console.log(result)
})(jQuery)