import React from "react"
import { Formik, FormikHelpers, FormikErrors } from 'formik'
import { Card, Button, Form } from "react-bootstrap";
import { newGoal, newTimeUtilityFunction, isApiErrorCode } from "../utils/utils";
import UtilityPicker from "../components/UtilityPicker"


type CreateGoalProps = {
  startTime: number;
  duration: number;
  apiKey: ApiKey;
  postSubmit: () => void;
}

function CreateGoal(props: CreateGoalProps) {
  type CreateGoalValue = {
    name: string,
    description: string,
    startTime: number,
    duration: number,
    points: { x: number, y: number }[]
  }

  const onSubmit = async (values: CreateGoalValue,
    fprops: FormikHelpers<CreateGoalValue>) => {

    let errors: FormikErrors<CreateGoalValue> = {};

    // Validate input

    let hasError = false;
    if (values.name === "") {
      errors.name = "Please enter an event name";
      hasError = true;
    }

    fprops.setErrors(errors);
    if (hasError) {
      return;
    }

    const maybeTimeUtilFunction = await newTimeUtilityFunction({
      startTimes: values.points.map(p => p.x),
      utils: values.points.map(p => p.y),
      apiKey: props.apiKey.key,
    })

    if (isApiErrorCode(maybeTimeUtilFunction)) {
      switch (maybeTimeUtilFunction) {
        case "API_KEY_NONEXISTENT": {
          fprops.setStatus({
            failureResult: "You have been automatically logged out. Please relogin.",
            successResult: ""
          });
          break;
        }
        case "TIME_UTILITY_FUNCTION_NOT_VALID": {
          fprops.setErrors({
            points: "Utility function is invalid."
          });
          break;
        }
        default: {
          fprops.setStatus({
            failureResult: "An unknown or network error has occured while trying to create utility function.",
            successResult: ""
          });
          break;
        }
      }
      return;
    }

    const maybeGoalData = await newGoal({
      name: values.name,
      description: values.description,
      durationEstimate: values.duration,
      timeUtilityFunctionId: maybeTimeUtilFunction.timeUtilityFunctionId,
      scheduled: true,
      startTime: values.startTime,
      duration: values.duration,
      apiKey: props.apiKey.key,
    });

    if (isApiErrorCode(maybeGoalData)) {
      switch (maybeGoalData) {
        case "API_KEY_NONEXISTENT": {
          fprops.setStatus({
            failureResult: "You have been automatically logged out. Please relogin.",
            successResult: ""
          });
          break;
        }
        default: {
          fprops.setStatus({
            failureResult: "An unknown or network error has occured while trying to create goal.",
            successResult: ""
          });
          break;
        }
      }
      return;
    }

    fprops.setStatus({
      failureResult: "",
      successResult: "Goal Created"
    });
    // execute callback
    props.postSubmit();
  }

  return <>
    <Formik<CreateGoalValue>
      onSubmit={onSubmit}
      initialValues={{
        name: "",
        description: "",
        startTime: props.startTime,
        duration: props.duration,
        points: [],
      }}
      initialStatus={{
        failureResult: "",
        successResult: ""
      }}
    >
      {(fprops) => <>
        <Form
          noValidate
          onSubmit={fprops.handleSubmit} >
          <div hidden={fprops.status.successResult !== ""}>
            <Form.Group>
              <Card>
                <Card.Body>
                  <UtilityPicker
                    startTime={props.startTime}
                    duration={props.duration}
                    points={fprops.values.points}
                    setPoints={p => fprops.setFieldValue("points", p)}
                  />
                </Card.Body>
              </Card>
              <Form.Text className="text-danger">{fprops.errors.points}</Form.Text>
            </Form.Group>

            <Form.Group >
              <Form.Control
                name="name"
                type="text"
                placeholder="Goal Name"
                as="input"
                value={fprops.values.name}
                onChange={e => fprops.setFieldValue("name", e.target.value)}
                isInvalid={!!fprops.errors.name}
              />
              <Form.Control.Feedback type="invalid">{fprops.errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group >
              <Form.Control
                name="description"
                type="text"
                placeholder="Goal Description (Optional)"
                as="textarea"
                value={fprops.values.description}
                onChange={e => fprops.setFieldValue("description", e.target.value)}
                isInvalid={!!fprops.errors.description}
              />
              <Form.Control.Feedback type="invalid">{fprops.errors.description}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Submit Form</Button>
            <br />
            <Form.Text className="text-danger">{fprops.status.failureResult}</Form.Text>
          </div>
          <Form.Text className="text-success">{fprops.status.successResult}</Form.Text>
        </Form>
      </>}
    </Formik>
  </>
}

export default CreateGoal;