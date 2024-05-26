namespace DBSiteNew.Data
{
    public class JwtSettings
    {
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int AccessTokenExpirationMin { get; set; } // Время жизни access token в минутах
        public int RefreshTokenExpirationDay { get; set; } // Время жизни refresh token в днях

    }
}
