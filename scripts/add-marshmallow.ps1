# PowerShell script to populate Marshmallow pet into Supabase database
$SUPABASE_URL = "https://afxkliyukojjymvfwiyp.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeGtsaXl1a29qanltdmZ3aXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjc1NTcsImV4cCI6MjA2OTc0MzU1N30.tAn3GDt39F4xVMubXBpgYKEXh9eleIQzGg6SmEucAdc"

Write-Host "Populating Marshmallow into Supabase database..." -ForegroundColor Cyan

# Marshmallow pet data
$marshmallow = @{
    id = "1"
    name = "Marshmallow"
    type = "cat"
    breed = "Munchkin"
    age = 1
    gender = "female"
    size = "small"
    color = "black and white"
    location = "Dhaka, Bangladesh"
    description = "Marshmallow is an absolutely adorable Munchkin kitten with stunning black and white markings! With her distinctive short legs and big personality, she loves to explore and play around the house."
    personality = @("Playful", "Curious", "Sweet", "Adorable")
    health_status = "healthy"
    vaccination_status = "up-to-date"
    images = @(
        "https://i.imgur.com/VdckEAH.jpg",
        "https://i.imgur.com/bWUizup.jpg",
        "https://i.imgur.com/pJrCpP1.jpg"
    )
    adoption_status = "available"
    owner_id = $null
    shelter_id = $null
} | ConvertTo-Json -Depth 10

# Headers for Supabase
$headers = @{
    "apikey" = $SUPABASE_ANON_KEY
    "Authorization" = "Bearer $SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation,resolution=merge-duplicates"
}

try {
    # Insert Marshmallow
    Write-Host "Sending request to: $SUPABASE_URL/rest/v1/pets" -ForegroundColor Yellow
    Write-Host "Data: $marshmallow" -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/pets" -Method Post -Headers $headers -Body $marshmallow
    
    Write-Host "Successfully inserted Marshmallow into database!" -ForegroundColor Green
    Write-Host "Pet ID: $($response.id)" -ForegroundColor Yellow
    Write-Host "Name: $($response.name)" -ForegroundColor Yellow
    Write-Host "Breed: $($response.breed)" -ForegroundColor Yellow
    
    # Verify the pet exists
    $verify = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/pets?id=eq.1&select=id,name,breed" -Method Get -Headers $headers
    Write-Host "" -NoNewline
    Write-Host "Verification: Found $($verify.Count) pet(s) with ID 1" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error inserting Marshmallow:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    Write-Host "Full Error:" -ForegroundColor Red
    Write-Host ($_ | ConvertTo-Json -Depth 5) -ForegroundColor Red
}
