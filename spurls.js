module.exports = settings => {
  const baseurl = `http://localhost:${
    settings.port
  }/sites/resourcebooking/_api/Web/Lists/getbytitle`;
  return {
    LITimeSlotCategory: `${baseurl}('LITimeSlotCategory')/items`,
    LITimeSlotGroup: `${baseurl}('LITimeSlotGroup')/items?$select=*,SCTimeSlotCategory/Id,SCTimeSlotCategory/Title&$expand=SCTimeSlotCategory/Id`,
    LITimeSlot: `${baseurl}('LITimeSlot')/items?$select=*,SCTimeSlotGroup/Id,SCTimeSlotGroup/Title&$expand=SCTimeSlotGroup/Id`,
    LIResource: `${baseurl}('LIResource')/items?$select=*,SCResourceGroup/Id,SCResourceGroup/Title,SCCustodian/Id,SCCustodian/Title&$expand=SCResourceGroup/Id,SCCustodian/Id`,
    LIResourceGroup: `${baseurl}('LIResourceGroup')/items?$select=*,SCTimeSlotCategory/Id,SCTimeSlotCategory/Title,SCCustodian/Id,SCCustodian/Title&$expand=SCTimeSlotCategory/Id,SCCustodian/Id`,
    LIAccessories: `${baseurl}('LIAccessories')/items?$select=*,SCCustodian/Id,SCCustodian/Title,SCResource/Id,SCResource/Title&$expand=SCCustodian/Id,SCResource/Id`,
    LIAcademicYear: `${baseurl}('LIAcademicYear')/items`,
    LIWeekMapping: `${baseurl}('LIWeekMapping')/items?$select=*,SCAcademicYear/Id,SCAcademicYear/Title,SCTimeSlotGroup/Id,SCTimeSlotGroup/Title&$expand=SCAcademicYear/Id,SCTimeSlotGroup/Id`,
    LIBooking: `${baseurl}('LIBooking')/items?$select=*,SCResource/Id,SCResource/Title,SCTimeSlot/Id,SCTimeSlot/Title,SCCustodian/Id,SCCustodian/Title&$expand=SCResource/Id,SCTimeSlot/Id,SCCustodian/Id`,
    LIBookingAccessories: `${baseurl}('LIBookingAccessories')/items?$select=*,SCAccessories/Id,SCAccessories/Title,SCBooking/Id,SCBooking/SCDate&$expand=SCAccessories/Id,SCBooking/Id`
  };
};
