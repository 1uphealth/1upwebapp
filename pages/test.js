import React from 'react';
import Layout from '../components/layouts/Layout';
import Header from '../components/Header.js';
import { FhirResource, Resources } from 'fhir-react';
import dstu2Observation from '../tests/fixtures/dstu2/Observation.json';
import dstu2Encounter from '../tests/fixtures/dstu2/Encounter.json';
import dstu2Patient from '../tests/fixtures/dstu2/Patient.json';
//          <Resources.TestComponent data={["....haha"]}/>

export default class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Header user={this.props.user} />
        <div className="container">
          <h1 className="text-center">Patient</h1>
          <FhirResource
            jsonOpen={true}
            fhirResource={dstu2Patient.entry[0].resource}
            thorough={false}
          />

          <h1 className="text-center">Encounter</h1>
          {dstu2Encounter.entry.map(function(eachEncounter) {
            return (
              <Resources.Encounter
                jsonOpen={true}
                fhirResource={eachEncounter.resource}
                thorough={false}
              />
            );
          })}

          <h1 className="text-center">Observation</h1>
          {dstu2Observation.entry.map(function(eachObservation) {
            return (
              <FhirResource
                jsonOpen={true}
                fhirResource={eachObservation.resource}
                thorough={false}
              />
            );
          })}
        </div>
      </Layout>
    );
  }
}
