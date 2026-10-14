# Classic ECUC Explorer

Source: `_files/422.arxml`, schema `AUTOSAR_4-2-2.xsd`, release 4.2 revision 2. This is a definition set, not a configured ECU or an Adaptive release catalog.

Run `python _scripts/build-standard-explorer.py` after updating the source intentionally. It writes one JSON file per module plus an index and source SHA-256. The current source contains 84 modules and 5,136 named module/container/parameter/reference definitions; 1,323 enum literal definitions are retained in metadata rather than counted as configurable tree nodes.

Standalone Notion tokens:

- `site:embed:autosar-all-explorer`: all 84 modules in one tree, with cross-module search.

- `site:embed:autosar-standard-explorer`: defaults to Dcm, all modules selectable.
- `site:embed:autosar-nvm-explorer`
- `site:embed:autosar-can-explorer`
- `site:embed:autosar-lin-explorer`

All 84 source modules register `site:embed:autosar-{lowercase module name}-explorer`, including `dem` and `cannm`. Module pages are organized into seven learning groups; these groups are not an official AUTOSAR layer taxonomy.

The browser renders original definitions and metadata in a two-column table as text, never as HTML. Missing multiplicity stays unknown. An infinite upper bound only applies when the source says true. Lower/upper bounds apply within a parent instance and must be read alongside conditions, choices, and variant rules. Enum literals are not given invented cardinalities.

IoHwAb is absent from this particular ECUC definition set. Its selector entry explains the limitation; do not invent a tree from vendor parameter names.

Legacy `.arxml[data-files]` Dcm blocks are upgraded by `_includes/js/arxml.js`. New pages should use the registered tokens.
