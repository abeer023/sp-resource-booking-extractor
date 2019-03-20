module.exports = settings => {
  const baseurl = `http://localhost:${settings.port}/sites/resourcebooking/_api/Web`;
  return {
    AvailableContentTypes: `${baseurl}/AvailableContentTypes?$select=Name,Id,StringId&$filter=startswith(Name,%27CT%27)`,
    SCCategory: `${baseurl}/fields/GetByTitle('SCCategory')?$select=Choices`,
    SiteUsers: `${baseurl}/siteusers?$select=*,Id,Title,LoginName,Email,UserPrincipalName,PrincipalType&$filter=Email+ne+%27%27`,
    LISettings: `${baseurl}/lists/getbytitle('LISettings')/items`,
    LIAcademicYear: `${baseurl}/lists/getbytitle('LIAcademicYear')/items`,
    LISchedule: `${baseurl}/lists/getbytitle('LISchedule')/items`,
    LITimeslot: `${baseurl}/lists/getbytitle('LITimeslot')/items?$select=*,SCSchedule/Id,SCSchedule/Title,SCSchedule/SCCategoryString&$expand=SCSchedule/Id`,
    LIResourceGroup: `${baseurl}/lists/getbytitle('LIResourceGroup')/items?$select=*,SCCustodian/Id,SCCustodian/Title,SCCustodian/Name,SCCustodian/EMail&$expand=SCCustodian/Id`,
    LIResource: `${baseurl}/lists/getbytitle('LIResource')/items?$select=*,SCResourceGroup/Id,SCResourceGroup/Title,SCResourceGroup/SCCategoryString,SCCustodian/Id,SCCustodian/Title,SCCustodian/Name,SCCustodian/EMail&$expand=SCResourceGroup/Id,SCCustodian/Id`,
    LIAccessories: `${baseurl}/lists/getbytitle('LIAccessories')/items?$select=*,SCResource/Id,SCResource/Title,SCCustodian/Id,SCCustodian/Title,SCCustodian/Name,SCCustodian/EMail&$expand=SCResource/Id,SCCustodian/Id`,
    LIWeekMapping: `${baseurl}/lists/getbytitle('LIWeekMapping')/items?$select=*,SCAcademicYear/Id,SCAcademicYear/Title,SCSchedule/Id,SCSchedule/Title,SCSchedule/SCCategoryString&$expand=SCAcademicYear/Id,SCSchedule/Id`
    // LIBooking: `${baseurl}('LIBooking')/items?$select=*,SCResource/Id,SCResource/Title,SCTimeSlot/Id,SCTimeSlot/Title,SCCustodian/Id,SCCustodian/Title&$expand=SCResource/Id,SCTimeSlot/Id,SCCustodian/Id`,
    // LIBookingAccessories: `${baseurl}('LIBookingAccessories')/items?$select=*,SCAccessories/Id,SCAccessories/Title,SCBooking/Id,SCBooking/SCDate&$expand=SCAccessories/Id,SCBooking/Id`
  };
};
