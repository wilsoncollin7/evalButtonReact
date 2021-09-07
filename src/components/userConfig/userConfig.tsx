import * as React from 'react';
// bootstrap
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Tools } from 'react-bootstrap-icons';
// utils
import { UserContext } from '../../utils/contexts/userContext';
import { UserData } from '../../utils/interfaces/healthInterfaces';
// components
import UserCheckBox from './userCheckBox';

export type Props = {
  children: React.ReactElement
};

export const UserConfig: React.FC<Props> = ({ children }) => {
  const { userData, possibleRoles, getUserData } = React.useContext(UserContext);
  const [user, setUser] = React.useState<UserData>();
  const [roles, setRoles] = React.useState<string[]>([]);
  const [allChecked, setAllChecked] = React.useState(false);
  const [isPublic, setIsPublic] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const toggleRole = (e: string) => {
    const role = e;
    if (role === 'developer') {
      userData.developer = userData.developer === false;
      if (userData.developer) {
        userData.roles.push(role);
      } else {
        userData.roles = userData.roles.filter((item: any) => {
          return (item !== role);
        });
      };
      return;
    };
    if (userData.roles.indexOf(role) !== -1) {
      if (role === 'Public') {
        userData.public = false;
        if (user !== undefined) {
          user.public = false;
        }
      };
      userData.roles = userData.roles.filter((i) => {
        return (i !== role);
      });
    } else {
      if (role === 'Public') {
        userData.roles = [];
        userData.public = true;
        if (isPublic) {
          setIsPublic(false);
        } else {
          setIsPublic(true);
        };
      };
      userData.roles.push(role);
    };
  };

  const toggleAllInternalRoles = () => {
    const roles: string[] = [];
    if (userData.roles.indexOf('developer') !== -1) {
      possibleRoles.forEach((role) => {
        if (role.toLowerCase().indexOf('developer') !== -1)
          return;
        if (role.toLowerCase().indexOf('public') !== -1)
          return;
        roles.push(role);
      });
    } else {
      possibleRoles.forEach((role) => {
        if (role.toLowerCase().indexOf('developer') === -1)
          return;
        roles.push(role);
      });
    };
    userData.roles = roles;
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllChecked(e.target.checked);
  };
  const handleToggleClick = () => {
    toggleAllInternalRoles()
  };

  // -----Used to updated Children-----
  const update = (e: string) => {
    let x = userData.roles.filter((i) => {
      return (i !== e);
    });
    setRoles(x);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShow(e.target.checked);
  };

  React.useEffect(() => {
    getUserData()
      .then((res: any) => {
        setUser(res);
      })
  }, [getUserData])

  return (
    <>
      <Row>
        <Col >
          <Card>
            <Card.Header>
              <Tools /> User Config
              <Form.Check className='float-end' type='switch' id='userConfigCheck' label={' User Config'} onChange={handleOnChange} />
            </Card.Header>
            <Card.Body hidden={!show}>
              <Form>
                {possibleRoles.map((item: any, idx: number) => (
                  <UserCheckBox
                    key={idx}
                    item={item}
                    allChecked={allChecked}
                    isPublic={isPublic}
                    toggleRole={toggleRole}
                    update={update}
                  />
                ))}
                <Form.Check
                  className='font-italic'
                  inline
                  label='All Internal Roles'
                  id='allRoles'
                  checked={allChecked}
                  onChange={handleToggleChange}
                  onClick={handleToggleClick}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs='1'></Col>
      </Row>
      {React.cloneElement(children, [roles])}
    </>
  );
};
