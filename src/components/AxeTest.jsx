import React, { useState, useRef } from 'react';
import axe from 'axe-core';

const AxeTestComponent = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const containerRef = useRef(null);

  const customStyles = {
    wrapper: {
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '20px',
    },
    textarea: {
      width: '100%',
      minHeight: '200px',
      padding: '8px',
      marginBottom: '16px',
      fontFamily: 'monospace',
    },
    button: {
      padding: '8px 16px',
      marginBottom: '20px',
    },
    resultSection: {
      marginBottom: '24px',
    },
    resultTitle: {
      fontSize: '1.2em',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    resultCount: {
      display: 'inline-block',
      padding: '2px 8px',
      marginLeft: '8px',
      borderRadius: '4px',
      fontSize: '0.9em',
    },
    item: {
      marginBottom: '16px',
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    htmlPreview: {
      background: '#f5f5f5',
      padding: '8px',
      overflow: 'auto',
      fontFamily: 'monospace',
      fontSize: '12px',
      marginTop: '8px',
      border: '1px solid #ddd',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    },
    link: {
      color: '#0066cc',
      textDecoration: 'none',
    },
    error: {
      color: '#dc2626',
      marginBottom: '16px',
    },
  };

  const sanitizeHtml = (html) => {
    // Create a temporary div
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove all style tags
    const styleTags = temp.getElementsByTagName('style');
    while (styleTags.length > 0) {
      styleTags[0].parentNode.removeChild(styleTags[0]);
    }

    // Remove style attributes
    const elementsWithStyle = temp.querySelectorAll('[style]');
    elementsWithStyle.forEach((el) => {
      el.removeAttribute('style');
    });

    // Remove link tags with rel="stylesheet"
    const styleLinks = temp.querySelectorAll('link[rel="stylesheet"]');
    styleLinks.forEach((link) => {
      link.parentNode.removeChild(link);
    });

    return temp.innerHTML;
  };

  const runAxeTest = async () => {
    if (!htmlContent.trim()) {
      setError('Please enter HTML content to test');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sanitize HTML before testing
      const sanitizedHtml = sanitizeHtml(htmlContent);

      if (containerRef.current) {
        containerRef.current.innerHTML = sanitizedHtml;
      }

      const results = await axe.run(containerRef.current, {
        runOnly: {
          type: 'tag',
          values: [
            'wcag2a',
            'wcag2aa',
            'wcag2aaa',
            'wcag21a',
            'wcag21aa',
            'wcag22a',
            'wcag22aa',
            'best-practice',
          ],
        },
      });
      setResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ResultSection = ({ title, items, type }) => {
    const getBackgroundColor = () => {
      switch (type) {
        case 'violations':
          return '#fee2e2';
        case 'incomplete':
          return '#fef3c7';
        case 'passes':
          return '#dcfce7';
        default:
          return '#f3f4f6';
      }
    };

    return (
      <div style={customStyles.resultSection}>
        <div style={customStyles.resultTitle}>
          {title}
          <span
            style={{
              ...customStyles.resultCount,
              backgroundColor: getBackgroundColor(),
            }}
          >
            {items.length}
          </span>
        </div>
        {items.map((item, index) => (
          <div key={index} style={customStyles.item}>
            <div>
              <strong>Rule:</strong> {item.id}
            </div>
            <div>
              <strong>Description:</strong> {item.description}
            </div>
            <div>
              <strong>Help:</strong> {item.help}
            </div>
            <div>
              <strong>Impact:</strong> {item.impact || 'none'}
            </div>
            {item.nodes?.length > 0 && (
              <div>
                <strong>Affected elements:</strong>
                {item.nodes.map((node, nodeIndex) => (
                  <pre key={nodeIndex} style={customStyles.htmlPreview}>
                    {node.html}
                  </pre>
                ))}
              </div>
            )}
            <a
              href={item.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={customStyles.link}
            >
              Learn more about this rule
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={customStyles.wrapper}>
      <textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        placeholder="Paste HTML content to test..."
        style={customStyles.textarea}
      />

      <button
        onClick={runAxeTest}
        disabled={loading}
        style={customStyles.button}
      >
        {loading ? 'Running Tests...' : 'Run Accessibility Tests'}
      </button>

      {error && <div style={customStyles.error}>{error}</div>}

      <div ref={containerRef} style={{ display: 'none' }} />

      {results && (
        <div>
          <ResultSection
            title="Violations"
            items={results.violations}
            type="violations"
          />
          <ResultSection
            title="Incomplete"
            items={results.incomplete}
            type="incomplete"
          />
          <ResultSection title="Passes" items={results.passes} type="passes" />
          <ResultSection
            title="Inapplicable"
            items={results.inapplicable}
            type="inapplicable"
          />
        </div>
      )}
    </div>
  );
};

export default AxeTestComponent;
