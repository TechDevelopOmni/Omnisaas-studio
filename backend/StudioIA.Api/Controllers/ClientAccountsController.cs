using Microsoft.AspNetCore.Mvc;
using StudioIA.Api.Contracts.ClientAccounts;
using StudioIA.Api.Services;

namespace StudioIA.Api.Controllers;

[ApiController]
[Route("api/client-accounts")]
public class ClientAccountsController(IClientAccountService clientAccountService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ClientAccountSummaryResponse>>> List(
        CancellationToken cancellationToken) =>
        Ok(await clientAccountService.ListAsync(cancellationToken));

    [HttpGet("{clientAccountId:guid}")]
    public async Task<ActionResult<ClientAccountDetailsResponse>> GetById(
        Guid clientAccountId,
        CancellationToken cancellationToken)
    {
        var response = await clientAccountService.GetByIdAsync(clientAccountId, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("by-user/{userKey}")]
    public async Task<ActionResult<ClientAccountDetailsResponse>> GetByUserKey(
        string userKey,
        CancellationToken cancellationToken)
    {
        var response = await clientAccountService.GetByUserKeyAsync(userKey, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{clientAccountId:guid}/profile")]
    public async Task<ActionResult<ClientAccountDetailsResponse>> UpdateProfile(
        Guid clientAccountId,
        [FromBody] UpdateClientProfileRequest request,
        CancellationToken cancellationToken)
    {
        var response = await clientAccountService.UpdateProfileAsync(clientAccountId, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{clientAccountId:guid}/payment-method")]
    public async Task<ActionResult<ClientAccountDetailsResponse>> UpdatePaymentMethod(
        Guid clientAccountId,
        [FromBody] UpdatePaymentMethodRequest request,
        CancellationToken cancellationToken)
    {
        var response = await clientAccountService.UpdatePaymentMethodAsync(clientAccountId, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{clientAccountId:guid}/subscriptions")]
    public async Task<ActionResult<ClientAccountDetailsResponse>> SetSubscription(
        Guid clientAccountId,
        [FromBody] UpdateSubscriptionRequest request,
        CancellationToken cancellationToken)
    {
        var response = await clientAccountService.SetSubscriptionAsync(clientAccountId, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }
}
