using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Contracts.ClientAccounts;
using StudioIA.Api.Data;
using StudioIA.Api.Entities;

namespace StudioIA.Api.Services;

public class ClientAccountService(StudioIaDbContext dbContext) : IClientAccountService
{
    public async Task<IReadOnlyList<ClientAccountSummaryResponse>> ListAsync(
        CancellationToken cancellationToken)
    {
        var entities = await dbContext.ClientAccounts
            .AsNoTracking()
            .Include(item => item.UserAccount)
            .Include(item => item.Subscriptions)
            .Include(item => item.ConfiguredAgents)
            .OrderBy(item => item.CompanyName)
            .ToListAsync(cancellationToken);

        return entities.Select(item => item.ToSummaryResponse()).ToList();
    }

    public async Task<ClientAccountDetailsResponse?> GetByIdAsync(
        Guid clientAccountId,
        CancellationToken cancellationToken)
    {
        var entity = await QueryClientAccounts()
            .FirstOrDefaultAsync(item => item.Id == clientAccountId, cancellationToken);

        return entity?.ToDetailsResponse();
    }

    public async Task<ClientAccountDetailsResponse?> GetByUserKeyAsync(
        string userKey,
        CancellationToken cancellationToken)
    {
        var normalizedKey = userKey.Trim().ToLowerInvariant();
        var entity = await QueryClientAccounts().FirstOrDefaultAsync(
            item =>
                item.UserAccountId.ToString().ToLower() == normalizedKey ||
                item.UserAccount.Email.ToLower() == normalizedKey,
            cancellationToken);

        return entity?.ToDetailsResponse();
    }

    public async Task<ClientAccountDetailsResponse?> UpdateProfileAsync(
        Guid clientAccountId,
        UpdateClientProfileRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await QueryClientAccounts()
            .FirstOrDefaultAsync(item => item.Id == clientAccountId, cancellationToken);

        if (entity is null)
        {
            return null;
        }

        entity.FullName = request.FullName;
        entity.CompanyName = request.CompanyName;
        entity.Email = request.Email;
        entity.Phone = request.Phone;
        entity.Document = request.Document;
        entity.Role = request.Role;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToDetailsResponse();
    }

    public async Task<ClientAccountDetailsResponse?> UpdatePaymentMethodAsync(
        Guid clientAccountId,
        UpdatePaymentMethodRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await QueryClientAccounts()
            .FirstOrDefaultAsync(item => item.Id == clientAccountId, cancellationToken);

        if (entity is null)
        {
            return null;
        }

        entity.PaymentBrand = request.Brand;
        entity.PaymentHolderName = request.HolderName;
        entity.PaymentLast4 = request.Last4;
        entity.PaymentExpiryMonth = request.ExpiryMonth;
        entity.PaymentExpiryYear = request.ExpiryYear;
        entity.BillingEmail = request.BillingEmail;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToDetailsResponse();
    }

    public async Task<ClientAccountDetailsResponse?> SetSubscriptionAsync(
        Guid clientAccountId,
        UpdateSubscriptionRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await QueryClientAccounts()
            .FirstOrDefaultAsync(item => item.Id == clientAccountId, cancellationToken);

        if (entity is null)
        {
            return null;
        }

        var category = await dbContext.CatalogCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Key == request.CategoryKey, cancellationToken);

        if (category is null)
        {
            return null;
        }

        var subscription = entity.Subscriptions.FirstOrDefault(
            item => item.CategoryKey == request.CategoryKey);

        if (subscription is null)
        {
            subscription = new DepartmentSubscription
            {
                Id = Guid.NewGuid(),
                ClientAccountId = entity.Id,
                CategoryKey = category.Key,
                CategoryLabel = category.Label,
                MonthlyPrice = category.MonthlyPrice,
                Status = request.Status,
                StartedAtUtc = request.Status == "active" ? DateTime.UtcNow : null,
            };

            entity.Subscriptions.Add(subscription);
        }
        else
        {
            subscription.Status = request.Status;
            subscription.CategoryLabel = category.Label;
            subscription.MonthlyPrice = category.MonthlyPrice;
            if (request.Status == "active" && subscription.StartedAtUtc is null)
            {
                subscription.StartedAtUtc = DateTime.UtcNow;
            }
        }

        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToDetailsResponse();
    }

    private IQueryable<ClientAccount> QueryClientAccounts() =>
        dbContext.ClientAccounts
            .Include(item => item.UserAccount)
            .Include(item => item.Subscriptions)
            .Include(item => item.ConfiguredAgents);
}
