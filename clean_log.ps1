try{
    Remove-Item C:\applok\logs\log.txt -ErrorAction Stop  
}catch{
    Write-Host "Erro para apagar o arquivo"
    Write-Host $_.Exception.Message
}