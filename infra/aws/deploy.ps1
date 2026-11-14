param(
  [Parameter(Mandatory = $true)]
  [string]$StateBucket,

  [Parameter(Mandatory = $true)]
  [string]$BudgetAlertEmail,

  [string]$Region = "us-east-1",
  [decimal]$MonthlyBudgetUsd = 10
)

$terraformDirectory = $PSScriptRoot
$terraformVersionOutput = & terraform version -json
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

$terraformVersion = [version](($terraformVersionOutput | ConvertFrom-Json).terraform_version)
if ($terraformVersion -lt [version]"1.10.0") {
  Write-Error "Terraform 1.10.0 or newer is required for S3 state locking."
  exit 1
}

& terraform "-chdir=$terraformDirectory" init `
  "-backend-config=bucket=$StateBucket" `
  "-backend-config=key=stadium/terraform.tfstate" `
  "-backend-config=region=$Region" `
  "-backend-config=encrypt=true" `
  "-backend-config=use_lockfile=true"
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

& terraform "-chdir=$terraformDirectory" apply `
  "-var=aws_region=$Region" `
  "-var=budget_alert_email=$BudgetAlertEmail" `
  "-var=monthly_budget_usd=$MonthlyBudgetUsd"
exit $LASTEXITCODE
