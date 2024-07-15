import React, { Component, ReactNode } from "react";
import mermaid from "mermaid";

interface MermaidComponentProps {
  chart: string;
  config: Object;
}

interface MermaidComponentState {
  svg: string | null;
}

class MermaidComponent extends Component<MermaidComponentProps, MermaidComponentState> {
  constructor(props: MermaidComponentProps) {
    super(props);
    this.state = {
      svg: null,
    };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps: MermaidComponentProps) {
    if (prevProps.chart !== this.props.chart) {
      this.renderChart();
      const chartElement = document.getElementById("mermaid-chart");
      if (chartElement) {
        chartElement.removeAttribute("data-processed");
        mermaid.contentLoaded();
      }
    }
  }

  renderChart = async () => {
    mermaid.initialize(this.props.config);
    mermaid.contentLoaded();
    try {
      const { svg } = await mermaid.render('mermaid-chart', this.props.chart);
      this.setState({ svg });
    } catch (error) {
      console.error("Error rendering Mermaid chart:", error);
    }
  }

  render(): ReactNode {
    return (
      <div className="mermaid-wrapper">
        {this.state.svg ? (
          <div dangerouslySetInnerHTML={{ __html: this.state.svg }} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}

export default MermaidComponent;