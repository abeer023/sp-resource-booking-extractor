module.exports = settings => {
  const baseurl = `http://localhost:${settings.port}/_api/Web`;
  return {
    AvailableContentTypes: `${baseurl}/AvailableContentTypes?$select=Name,Id,StringId&$filter=startswith(Name,%27CT%27)`,
    RBSCCategory: `${baseurl}/fields/GetByTitle('RBSCCategory')?$select=Choices`,
    SiteUsers: `${baseurl}/siteusers?$select=*,Id,Title,LoginName,Email,UserPrincipalName,PrincipalType&$filter=Email+ne+%27%27`,
    // LISettings: `${baseurl}/lists/getbytitle('LISettings')/items`,
    // LIAcademicYear: `${baseurl}/lists/getbytitle('LIAcademicYear')/items`,
    // LISchedule: `${baseurl}/lists/getbytitle('LISchedule')/items`,
    // LITimeslot: `${baseurl}/lists/getbytitle('LITimeslot')/items?$select=*,RBSCSchedule/Id,RBSCSchedule/Title,RBSCSchedule/RBSCCategoryString&$expand=RBSCSchedule/Id`,
    // LIResourceGroup: `${baseurl}/lists/getbytitle('LIResourceGroup')/items?$select=*,RBSCCustodian/Id,RBSCCustodian/Title,RBSCCustodian/Name,RBSCCustodian/EMail&$expand=RBSCCustodian/Id`,
    // LIResource: `${baseurl}/lists/getbytitle('LIResource')/items?$select=*,RBSCResourceGroup/Id,RBSCResourceGroup/Title,RBSCResourceGroup/RBSCCategoryString,RBSCCustodian/Id,RBSCCustodian/Title,RBSCCustodian/Name,RBSCCustodian/EMail&$expand=RBSCResourceGroup/Id,RBSCCustodian/Id`,
    // LIAccessory: `${baseurl}/lists/getbytitle('LIAccessory')/items?$select=*,RBSCResources/Id,RBSCResources/Title,RBSCCustodian/Id,RBSCCustodian/Title,RBSCCustodian/Name,RBSCCustodian/EMail&$expand=RBSCResources/Id,RBSCCustodian/Id`,
    // LIWeekMapping: `${baseurl}/lists/getbytitle('LIWeekMapping')/items?$select=*,RBSCAcademicYear/Id,RBSCAcademicYear/Title,RBSCSchedule/Id,RBSCSchedule/Title,RBSCSchedule/RBSCCategoryString&$expand=RBSCAcademicYear/Id,RBSCSchedule/Id`
    // // LIBooking: `${baseurl}('LIBooking')/items?$select=*,RBSCResource/Id,RBSCResource/Title,RBSCTimeSlot/Id,RBSCTimeSlot/Title,RBSCCustodian/Id,RBSCCustodian/Title&$expand=RBSCResource/Id,RBSCTimeSlot/Id,RBSCCustodian/Id`,
    // // LIBookingAccessories: `${baseurl}('LIBookingAccessories')/items?$select=*,RBSCAccessories/Id,RBSCAccessories/Title,RBSCBooking/Id,RBSCBooking/RBSCDate&$expand=RBSCAccessories/Id,RBSCBooking/Id`
  };
};
