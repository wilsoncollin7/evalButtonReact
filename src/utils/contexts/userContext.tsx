import * as React from 'react';
// utils
import { UserData } from '../interfaces/healthInterfaces';
import {
  GetUserName,
  GetUserGroups
} from '../../graphql/queries/queries';

export type UserContextType = {
  userData: UserData
  possibleRoles: string[]
  fetchUserData: () => void
  getUserData: () => any
  inGroups: (roles: string[]) => boolean
  notInGroups: (roles: string[]) => boolean
};

export type Props = {
  children: React.ReactNode
};

const contextDefaultValues: UserContextType = {
  userData: {
    userName: '',
    groups: [],
    roles: [],
    developer: false,
    wasDeveloper: false,
    domainUser: false,
    public: false,
    ready: false,
    repositoryURL: ''
  },
  possibleRoles: [],
  fetchUserData: () => { },
  getUserData: () => { },
  inGroups: () => false,
  notInGroups: () => false,
};

export const UserContext = React.createContext(contextDefaultValues);

const UserProvider: React.FC<Props> = ({ children }) => {
  const [userData] = React.useState<UserData>(contextDefaultValues.userData);

  const possibleRoles = [
    'permittingClerk',
    'permittingAdmin',
    'engineering',
    'stormWater',
    'fire',
    'env.health',
    'utilities',
    'planning',
    'cama',
    'permitting',
    'floodPlain',
    'planReview',
    'finance',
    'bcdevelopers',
    'cp-developers',
    'unlicensed',
    'inspectionUser',
    'BCPublic',
    'Public',
    'developer'
  ].sort();

  const getUserRoles = () => {
    userData.domainUser = false;
    if (userData.groups.length > 0) {
      userData.groups.forEach((item: string) => {
        switch (item) {
          case 'BCMS_PermittingClerk':
            userData.roles.push('permittingClerk');
            break;
          case 'BCMS_PermittingAdmin':
            userData.roles.push('permittingAdmin');
            break;
          case 'BCMS_Engineering':
            userData.roles.push('engineering');
            break;
          case 'BCMS_Stormwater':
            userData.roles.push('stormWater');
            break;
          case 'BCMS_Fire':
            userData.roles.push('fire');
            break;
          case 'BCMS_Environmental Health':
            userData.roles.push('env.health');
            break;
          case 'BCMS_Utilities':
            userData.roles.push('utilities');
            break;
          case 'BCMS_Planning':
            userData.roles.push('planning');
            userData.roles.push('cama');
            break;
          case 'BCMS_Permitting':
            userData.roles.push('permitting');
            break;
          case 'BCMS_Floodplain':
            userData.roles.push('floodPlain');
            userData.roles.push('permitting');
            break;
          case 'BCMS_Plan Review':
            userData.roles.push('planReview');
            break;
          case 'BCMS_Finance':
            userData.roles.push('finance');
            break;
          case 'bcdevelopers':
            userData.roles.push('bcdevelopers');
            break;
          case 'CP-Developers':
            userData.roles.push('cp-developers');
            break;
          case 'BCMS_Unlicensed':
            userData.roles.push('unlicensed');
            break;
          case 'InspectionUser':
            userData.roles.push('inspectionUser');
            break;
          case 'Domain Users':
            userData.domainUser = true;
            break;
        };
      });
    };
    userData.groups.filter((item: string) => {
      if (item === 'developer') {
        userData.developer = true;
        userData.wasDeveloper = true;
        userData.roles.push('developer');
      };
      return null;
    });
    if (userData.roles.length === 0 && userData.domainUser === false && userData.developer === false) {
      userData.roles.push('Public');
    };
    userData.roles.filter((item: string) => {
      if (item === 'Public') {
        userData.public = true;
      };
      return null;
    });
  };

  const checkRoles = (roles: string[]) => {
    if (typeof roles !== 'object') {
      const message = 'Invalid user role sent to user factory: ' + JSON.stringify(roles);
      console.warn(message);
      return;
    };
    roles.forEach((role: string) => {
      if (possibleRoles.indexOf(role) === -1) {
        const message = 'Invalid user role sent to user factory: ' + JSON.stringify(role);
        console.warn(message);
      };
    });
  };

  const inGroups = (roles: string[]) => {
    if (typeof roles === 'string')
      roles = [roles];
    checkRoles(roles);
    if (userData === undefined || userData.roles === undefined || userData.roles.length === 0)
      return false;
    if (userData.developer)
      return true;
    var matches = 0;
    roles.forEach((role: string) => {
      userData.roles.filter((item: string) => {
        if (item === role) {
          matches++;
        };
        return null;
      });
    });
    return (matches > 0);
  };

  const notInGroups = (roles: string[]) => {
    return inGroups(roles) === false;
  };

  const fetchUserData = () => {
    return new Promise<void>((resolve, reject) => {
      let complete = 0;
      function callComplete() {
        complete++;
        if (complete === 2) {
          resolve();
        };
      };
      GetUserName()
        .then(res => {
          const data = res;
          userData.userName = data;
          callComplete();
        }).catch(() => {
          reject();
        });
      GetUserGroups()
        .then(res => {
          const data = res;
          userData.groups = data;
          callComplete();
        }).catch(() => {
          reject();
        });
    });
  };

  const getUserData = () => {
    return new Promise<UserData>((resolve, reject) => {
      fetchUserData()
        .then(() => {
          getUserRoles();
          resolve(userData);
        });
    });
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        possibleRoles,
        fetchUserData,
        getUserData,
        inGroups,
        notInGroups
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
