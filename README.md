# Web Accessibility Testing Tool

A React TypeScript application for automated accessibility testing of websites using the WAVE API. This tool helps identify accessibility issues across multiple web pages and generates comprehensive reports in various formats.

## Features

- **Batch Website Testing**: Test multiple URLs simultaneously
- **Real-time Status Updates**: Monitor testing progress for each URL
- **Comprehensive Analysis**: Based on WCAG 2.1 AA guidelines
- **Multiple Export Formats**: Export results as JSON, CSV, or PDF
- **Domain Aggregation**: Automatically groups results by domain
- **Severity Classification**: Categorizes issues by severity level (Critical, High, Medium, Info)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your WAVE API key:
```env
REACT_APP_WAVE_API_KEY=your_api_key_here
```

## Usage

1. Start the development server:
```bash
npm start
```

2. Open the application in your browser at `http://localhost:3000`

3. Enter URLs (one per line) in the input field:
```
https://example.com
https://example.com/contact
https://example.com/about
```

4. Click "Test Websites" to begin the analysis

## Export Options

### JSON Export
- Complete test results
- Grouped by domain
- Includes all issue details and statistics

### CSV Export (ZIP containing multiple files)
- `domain-summary.csv`: Overview of issues by domain
- `page-details.csv`: Detailed page-by-page analysis
- `all-issues.csv`: Complete list of individual issues

### PDF Export
- Professional report format
- Executive summary
- Domain-wise breakdown
- Issue statistics and details
- Most common issues
- Page-by-page analysis

## Project Structure

```
src/
├── components/         # React components
│   ├── BatchProcessing.tsx
│   ├── ExportButton.tsx
│   ├── WebsiteReport.tsx
│   └── ...
├── types/             # TypeScript interfaces
│   ├── wave.ts
│   ├── batch.ts
│   └── aggregate.ts
├── utils/             # Utility functions
│   ├── domain.ts
│   ├── exportFormatters.ts
│   └── ...
└── services/          # API services
    └── waveApi.ts
```

## Technical Details

### Built With
- React
- TypeScript
- WAVE API
- jsPDF (PDF generation)
- PapaParse (CSV handling)
- JSZip (ZIP file creation)

### Key Components

#### BatchProcessing
- Manages multiple URL testing
- Handles test queue and rate limiting
- Provides real-time status updates

#### ExportButton
- Supports multiple export formats
- Handles file generation and download
- Includes progress indication

#### WebsiteReport
- Displays test results
- Shows issue details and statistics
- Provides filtering and sorting options

## API Rate Limits

The application respects WAVE API rate limits by:
- Processing URLs in small batches
- Implementing delays between requests
- Handling rate limit errors gracefully

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- WAVE API for accessibility testing

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.