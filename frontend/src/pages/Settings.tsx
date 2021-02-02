import React from 'react';
import { Popover, Form, Container } from 'react-bootstrap'

import UtilityWrapper from '../components/UtilityWrapper';

import DashboardLayout from '../components/DashboardLayout';
import CreatePassword from '../components/CreatePassword';
import CreateSubscription from '../components/CreateSubscription';


function Settings(props: AuthenticatedComponentProps) {

  // TODO actually add backend components to handle changing the name properly
  // Also, make the name and email and password changes into one box initially
  // Then, when you click on them to change, a modal should pop up
  // IMO this would look better than the tiny boxes we have now

  const [passwdSuccess, setPasswdSuccess] = React.useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = React.useState(false);
  return <DashboardLayout {...props}>
    <Container fluid className="py-4 px-4">
      <div className="mx-3 my-3">
        <UtilityWrapper title="Change Password">
          <Popover id="information-tooltip"> Shows basic information about this course. </Popover>
          {passwdSuccess
            ? <Form.Text className="text-success">Password changed successfully</Form.Text>
            : <CreatePassword apiKey={props.apiKey} onSuccess={() => setPasswdSuccess(true)} />
          }
        </UtilityWrapper>
      </div>

      <div className="mx-3 my-3">
        <UtilityWrapper title="Manage Subscription">
          <Popover id="information-tooltip"> Purchase a premium subscription that permits you to manage classes and schools. </Popover>
          <>
            {subscribeSuccess
              ? <Form.Text className="text-success">Subscription Created Successfully</Form.Text>
              : <CreateSubscription apiKey={props.apiKey} onSuccess={() => setSubscribeSuccess(true)} />
            }
          </>
        </UtilityWrapper>
      </div>

    </Container>
  </DashboardLayout>
}

export default Settings;
