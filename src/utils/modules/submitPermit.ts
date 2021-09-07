import {
  GetHealthPermitsByHealthPermitProjectKey,
  AddHealthPermit,
  GetPermitTypeAttributes,
  AddHealthPermitTypeAttributes,
  UpdateHealthPermitTypeAttributes,
  UpdateHealthPermit
} from '../../graphql/queries/queries';
import { permitsFilter, statusFilter } from '../filters/healthFilters';
import { PermitAttributes, PermitProject, Permit } from '../interfaces/healthInterfaces';

export const newPermit = (attributes: PermitAttributes, project: PermitProject, user: string, fee: number) => {
  const getNumberOfPermits = () => {
    GetHealthPermitsByHealthPermitProjectKey(project.healthPermitProjectKey)
      .then(res => {
        const value: number = permitsFilter(res).length;
        constructPermit(value);
      });
  };
  const constructPermit = (numberOfPermits: number) => {
    const permit: Permit = {
      healthPermitProjectKey: project.healthPermitProjectKey,
      permitNumber: `${1000 + numberOfPermits}`,
      permitTypeKey: attributes.permitTypeKey,
      description: attributes.description,
      permitAmount: fee,
      pendingPayment: false,
      permitStatusKey: 1,
      finalPassed: false,
      creationDate: new Date(),
      dateIssued: new Date(),
      createUser: user,
      updateUser: user,
      expireDate: new Date('2999-12-31'),
      eventConfirm: false
    };
    AddHealthPermit(permit)
      .then(res => {
        console.log('Permit Created!');
        constructPermitAttributes( Object.entries(attributes), attributes.permitTypeKey, user, res.healthPermitKey, project.healthPermitProjectKey);
        newHealthEvent({newEval: ''}, project.healthPermitProjectKey, user, 1859, `${1000 + numberOfPermits}`, '', Object.entries(attributes))
      });
  };
  if (attributes && project) {
    getNumberOfPermits();
  };
};

export const constructPermitAttributes = (attributes: [string, any][], type: number, user: string, healthPermitKey: number, healthPermitProjectKey: number) => {
  GetPermitTypeAttributes(healthPermitProjectKey, type)
    .then(res => {
      const types = res;
      types.forEach((item: any) => {
        attributes.filter((x: any) => {
          if (item.description === x[0]) {
            const attribute = {
              'healthPermitKey': healthPermitKey,
              'isRequired': item.isRequired,
              'validation': item.validation,
              'attributeDescription': item.description,
              'attributeDataType': item.attributeDataType,
              'attributeOrder': item.attributeOrder,
              'displayColumn': item.displayColumn,
              'feeCategory': item.feeCategory,
              'labelDisplayColumn': item.labelDisplayColumn,
              'radioButtonLabel': item.radioButtonLabel,
              'attributeValue': x[1] || null,
              'createUser': user,
              'updateUser': user
            };
            AddHealthPermitTypeAttributes(attribute);
          };
          return true;
        });
      });
    });
};

export const newHealthEvent = (data: any, healthPermitProjectKey: number, user: string, type: number, permitNumber: string, overrideReason?: string, attributes?: [string, any][]) => {
  const events = Object.entries(data);
  events.forEach((item: any) => {
    if (item[0] === 'description') {
      return;
    };
    let message: string = '';
    switch (item[0]) {
      case 'permitAmount':
        message = ('Permit: ' + permitNumber + ' Type: Site Evaluation Fee has changed to: $' + item[1] + ' by: ' + user + ' - ' + overrideReason)
        break;
      case 'permitStatusKey':
        message = ('Status for permit ' + permitNumber + ' set to ' + statusFilter(item[1]) + ' by ' + user);
        break;
      case 'finalPassed':
        message = ('Final Passed for permit ' + permitNumber + ' set to ' + item[1] + ' by ' + user);
        break;
      case 'newEval':
        let parts: string = '';
        let description: string = '';
        if (attributes !== undefined) {
          attributes.forEach((item: any) => {
            if (item[0] === 'description') {
              description = item[1];
              return;
            } else if (item[0] === 'permitTypeKey') {
              return;
            };
            parts += item[0] + ': ' + item[1] + '\n\n ';
          });
        };
        message = ('Permit: ' + permitNumber + ' Type: Site Evaluation was created by: ' + user + '\n\n Description - ' + description + '\n\n Attributes - \n\n '+ parts);
        break;
    };
    const event: Permit = {
      healthPermitProjectKey: healthPermitProjectKey,
      permitNumber: '9999',
      permitTypeKey: type,
      description: message,
      permitAmount: 0,
      pendingPayment: false,
      permitStatusKey: null,
      finalPassed: false,
      creationDate: null,
      dateIssued: null,
      createUser: user,
      updateUser: user,
      expireDate: new Date('1900-1-1'),
      eventConfirm: false
    };
    AddHealthPermit(event)
      .then(res => {
        let note: [string, any][] = [['Note', message]];
        constructPermitAttributes(note, type, user, res.healthPermitKey, healthPermitProjectKey);
      });
  });
};

export const updatePermitAttributes = (data: any) => {
  if (data !== undefined) {
    const values = Object.entries(data);
    values.forEach((item: any) => {
      UpdateHealthPermitTypeAttributes(parseInt(item[0]), item[1])
        .then(res => {
          console.log(`Attributes updated!`);
        });
    });
  };
};

export const updateHealthPermit = (healthPermitKey: number, data: any) => {
  if (data !== undefined) {
    UpdateHealthPermit(healthPermitKey, data)
      .then(res => {
        console.log(`Permit updated!`);
      });
  };
};
