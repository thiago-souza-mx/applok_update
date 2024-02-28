

try{
    Get-Content -path "C:\applok\logs\log.txt" -Wait -ErrorAction Stop 
}catch{
    Write-Host "Erro para abrir o arquivo"
    Write-Host $_.Exception.Message -Wait
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');
}