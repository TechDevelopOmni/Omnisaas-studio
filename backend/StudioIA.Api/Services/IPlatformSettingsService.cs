using StudioIA.Api.Contracts.PlatformSettings;

namespace StudioIA.Api.Services;

public interface IPlatformSettingsService
{
    Task<PlatformSettingsResponse> GetAsync(CancellationToken cancellationToken);
    Task<PlatformSettingsResponse> UpdateAsync(UpdatePlatformSettingsRequest request, CancellationToken cancellationToken);
}
