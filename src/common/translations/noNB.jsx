const noNB = {

    // Root
    noRowsLabel: 'Ingen rader',
    noResultsOverlayLabel: 'Ingen resultater funnet.',
    errorOverlayDefaultLabel: 'En feil oppstod.',

    // Density selector toolbar button text
    toolbarDensity: 'Visning',
    toolbarDensityLabel: 'Høyde',
    toolbarDensityCompact: 'Kompakt',
    toolbarDensityStandard: 'Standard',
    toolbarDensityComfortable: 'Stor',

    // Columns selector toolbar button text
    toolbarColumns: 'Kolonner',
    toolbarColumnsLabel: 'Kolonner',

    // Filters toolbar button text
    toolbarFilters: 'Filters',
    toolbarFiltersLabel: 'Vis filtre',
    toolbarFiltersTooltipHide: 'Skjul filtre',
    toolbarFiltersTooltipShow: 'Vis filtre',
    /* toolbarFiltersTooltipActive: (count) =>
        count !== 1 ? `${count} aktive filtre` : `${count} aktive filter`, */

    // Export selector toolbar button text
    toolbarExport: 'Eksporter',
    toolbarExportLabel: 'Eksporter',
    toolbarExportCSV: 'Last ned som CSV',
    toolbarExportPrint: 'Skriv ut',

    // Columns panel text
    columnsPanelTextFieldLabel: 'Finn kolonne',
    columnsPanelTextFieldPlaceholder: 'Kolonnetittel',
    columnsPanelDragIconLabel: 'Reorder column',
    columnsPanelShowAllButton: 'Vis alle',
    columnsPanelHideAllButton: 'Skjul alle',

    // Filter panel text
    filterPanelAddFilter: 'Legg til filter',
    filterPanelDeleteIconLabel: 'Slett',
    filterPanelOperators: 'Operatorer',
    filterPanelOperatorAnd: 'Og',
    filterPanelOperatorOr: 'Eller',
    filterPanelColumns: 'Columns',
    filterPanelInputLabel: 'Verdi',
    filterPanelInputPlaceholder: 'Filterverdi',

    // Filter operators text
    filterOperatorContains: 'inneholder',
    filterOperatorEquals: 'er lik',
    filterOperatorStartsWith: 'starter med',
    filterOperatorEndsWith: 'slutter med',
    filterOperatorIs: 'er',
    filterOperatorNot: 'er ikke',
    filterOperatorAfter: 'er etter',
    filterOperatorOnOrAfter: 'er på eller etter',
    filterOperatorBefore: 'er før',
    filterOperatorOnOrBefore: 'er på eller før',
    filterOperatorIsEmpty: 'er tom',
    filterOperatorIsNotEmpty: 'er ikke tom',
    filterOperatorIsAnyOf: 'er noen av',

    // Filter values text
    filterValueAny: 'noen',
    filterValueTrue: 'true',
    filterValueFalse: 'false',

    // Column menu text
    columnMenuLabel: 'Meny',
    columnMenuShowColumns: 'Vis kolonner',
    columnMenuFilter: 'Filter',
    columnMenuHideColumn: 'Skjul',
    columnMenuUnsort: 'Unsort',
    columnMenuSortAsc: 'Sorter etter ASC',
    columnMenuSortDesc: 'Sorter etter DESC',

    // Column header text
    /*  columnHeaderFiltersTooltipActive: (count) =>
        count !== 1 ? `${count} aktive filtre` : `${count} aktive filter`, */
    columnHeaderFiltersLabel: 'Vis filtre',
    columnHeaderSortIconLabel: 'Sorter',

    // Rows selected footer text
    /* footerRowSelected: (count) =>
        count !== 1
            ? `${count.toLocaleString()} rader valgt`
            : `${count.toLocaleString()} rad valgt`,
    */
    // Total rows footer text
    footerTotalRows: 'Totalt antall rader:',

    // Total visible rows footer text
    /* footerTotalVisibleRows: (visibleCount, totalCount) =>
        `${visibleCount.toLocaleString()} av ${totalCount.toLocaleString()}`, */

    // Checkbox selection text
    checkboxSelectionHeaderName: 'Checkbox selection',
    checkboxSelectionSelectAllRows: 'Velg alle rader',
    checkboxSelectionUnselectAllRows: 'Unselect all rows',
    checkboxSelectionSelectRow: 'Velg rad',
    checkboxSelectionUnselectRow: 'Unselect row',

    // Boolean cell text
    booleanCellTrueLabel: 'true',
    booleanCellFalseLabel: 'false',

    // Actions cell more text
    actionsCellMore: 'mer',

    // Column pinning text
    pinToLeft: 'Pin til venstre',
    pinToRight: 'Pin til høyre',
    unpin: 'Unpin',

    // Tree Data
    treeDataGroupingHeaderName: 'Gruppe',
    treeDataExpand: 'se barn',
    treeDataCollapse: 'skjul barn',

    // Grouping columns
    groupingColumnHeaderName: 'Gruppe',
    groupColumn: (name) => `Gruppe av ${name}`,
    unGroupColumn: (name) => `Slutt å gruppere etter ${name}`,

    // Master/detail
    expandDetailPanel: 'Utvide',
    collapseDetailPanel: 'Kollapse',

    // Used core components translation keys
    MuiTablePagination: {},
};

export default noNB;
