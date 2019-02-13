/**
  @typedef HTTCOpts
  @type {object}
  @property {any}         tableElement - an element to use
  @property {boolean}     firstLineAsHeader - define if the first line should be used as a header
  @property {boolean}     forceDownload - force download
  @property {HTTCOptsOutput}  output - output options
*/

/**
  @typedef HTTCOptsOutput
  @type {object}
  @property {string}  filename - file name (only used with forceDownload option)
  @property {boolean} extension - file extension (only used with forceDownload option)
  @property {boolean} separator - csv value separator
  @property {boolean} lineBreak - csv line break char
*/

($ => {
  const arrayToCSV = (arr, separator) => arr.join(separator);
  const getText = el => el.innerText;

  const downloadFile = ({ filename, content }) => {
    const blob = new Blob(content, {
      type: 'text/csv;charset=utf-8;'
    });

    saveAs(blob, filename);
  };

  /** @type {(opts: HTTCOpts) => string}  */
  const normalizeFilename = opts => {
    let filename = opts.output.filename;
    return filename.includes('.')
      ? filename
      : `${filename}.${opts.output.extension}`;
  };

  /** @type {(opts: HTTCOpts) => string | void}  */
  const htmlTableToCSV = opts => {
    let trs = [];
    let header = [];
    let lines = [];

    const defaultOpts = {
      tableElement: null,
      firstLineAsHeader: false,
      forceDownload: false,
      output: {
        filename: 'csv-table',
        separator: ',',
        extension: 'csv',
        lineBreak: '\r\n'
      }
    };

    /** @type {HTTCOpts}  */
    const $opts = $.extend(true, defaultOpts, opts);

    $opts.output.filename = normalizeFilename($opts);

    if (!$opts.tableElement) {
      return console.error('Missing table element');
    }

    trs = $opts.tableElement.find('tr');

    if ($opts.firstLineAsHeader) {
      const ths = $(trs.get(0))
        .find('th')
        .toArray();
      header = ths.map(getText);
    }

    /* use reduce to skip first line if its header */
    lines = trs.toArray().reduce((arr, tr, index) => {
      if ($opts.firstLineAsHeader && index == 0) {
        return arr;
      }
      /* tr element with tds */
      const tds = $(tr)
        .children()
        .toArray();
      arr.push(tds.map(getText));

      return arr;
    }, []);

    /* flatten lines and join with header */
    const buffer = [header, ...lines];

    const csv =
      /* return an array of strings glued with given separator */
      buffer
        .map(line => arrayToCSV(line, $opts.output.separator))
        /* join then with new lines */
        .join($opts.output.lineBreak);

    if ($opts.forceDownload) {
      return downloadFile({
        filename: $opts.output.filename,
        content: [csv]
      });
    }

    return csv;
  };

  window.htmlTableToCSV = htmlTableToCSV;
})(jQuery);
