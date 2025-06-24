export declare class DeactivateApplicationDto {
    status: 'Inactive' | 'Active';
    deactivationType: 'Temporary' | 'Permanent';
    startDate?: string;
    endDate?: string;
}
