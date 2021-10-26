import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: '/home', name: 'Dashboard', type: 'link', icon: 'dashboard' },
  { state: 'authorization', type: 'header', name: 'Authorization', icon: 'view_list'  },
  { state: '/verification/member-authorization', name: 'Member Authorization', type: 'link', icon: 'keyboard_arrow_right', permissions: 'Verifications' },
  { state: '/verification/form2c', name: 'Form 2C', type: 'link', icon: 'keyboard_arrow_right', permissions: 'Issuing Form 2C' },
  { state: '/verification/form2e', name: 'Form 2E', type: 'link', icon: 'keyboard_arrow_right', permissions: 'Issuing Form 2E' },
  { state: '/verification/posted-forms', name: 'Posted Forms (2c&2e)', type: 'link', icon: 'keyboard_arrow_right', permissions: 'Issuing Form 2C' },
  { state: 'claims-management', type: 'header', name: 'Claims Management', icon: 'dashboard' },
  { state: '/claims/claim-register', type: 'link', name: 'Claim Register', icon: 'keyboard_arrow_right', permissions:'' },
  { state: 'serviceapproval', type: 'header', name: 'Service Approval', icon: 'view_list'  },
  { state: '/service-approval/request-approval', type: 'link', name: 'Request Approval', icon: 'keyboard_arrow_right' },
  { state: '/service-approval/view-approvals', type: 'link', name: 'View Approvals', icon: 'keyboard_arrow_right' },

  { state: 'investigation', type: 'header', name: 'Diagnosis/Investigation', icon: 'view_list', permissions:'' },
  { state: '/investigation/receiving-form2e', type: 'link', name: 'Receiving Form 2e', icon: 'keyboard_arrow_right' },
  //{ state: '/investigation/claim-register', type: 'link', name: 'Claim Register', icon: 'keyboard_arrow_right' },

  //{ state: 'overvisits', type: 'link', name: 'Overvisits', icon: 'keyboard_arrow_right' },
  
  //{ state: 'reports', type: 'header', name: 'Reports', icon: 'view_list' },
  //{ state: 'claim-itemsummary', type: 'link', name: 'Claim Summary By Item', icon: 'keyboard_arrow_right' },
  //{ state: 'claim-summary-byitemtypes', type: 'link', name: 'Claim Summary By Item Types', icon: 'keyboard_arrow_right' },
  //{ state: 'claim-summary-bydate', type: 'link', name: 'Claim Summary By Date', icon: 'keyboard_arrow_right' },
 // { state: 'claimtype-summary-bydate', type: 'link', name: 'Claim Type Summary By Date', icon: 'keyboard_arrow_right' },
  //{ state: 'detailed-claims-report', type: 'link', name: 'Detailed Claims Report', icon: 'keyboard_arrow_right' },
  //{ state: 'data-entry-statistics', type: 'link', name: 'Data Entry Statistics', icon: 'keyboard_arrow_right' },

  


  { state: 'pharmacy', type: 'header', name: 'Pharmacy', icon: 'view_list', permissions:'' },
  { state: '/pharmacy/posted-folios', type: 'link', name: 'Receiving Form 2C', icon: 'keyboard_arrow_right' },
  { state: '/pharmacy/claim-register', type: 'link', name: 'Claim Register', icon: 'keyboard_arrow_right' },
];


@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }


}
