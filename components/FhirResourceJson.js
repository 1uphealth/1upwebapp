import React from 'react';

export default class FhirResourceJson extends React.Component {
  render() {
    let componentType;
    if (this.props.fhirResource.resource.resourceType === 'Patient') {
      componentType = (
        <Patient patientProps={this.props.fhirResource.resource.resourceType} />
      );
    } else {
      componentType = <JsonFormater fhirResource={this.props.fhirResource} />;
    }
    return (
      <div className="bg-light card mb-6">
        <div className="card-header">
          {this.props.fhirResource.resource.resourceType}
        </div>
        <div className="card-body">{componentType}</div>
      </div>
    );
  }
}
class Patient extends React.Component {
  render() {
    return (
      <div>
        <h1>lol</h1>
      </div>
    );
  }
}
class JsonFormater extends React.Component {
  render() {
    return (
      <code>
        <pre>{JSON.stringify(this.props.fhirResource, null, 2)}</pre>
      </code>
    );
  }
}
