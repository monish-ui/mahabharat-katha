"""
Create the Play Store UPLOAD key as a PKCS12 keystore (no JDK needed).

  py -3 scripts/make-keystore.py D:\\mahabharat-secrets

Writes, outside the repo:
  upload-keystore.p12   the keystore (alias "mahabharat")
  KEYSTORE-README.txt   password, alias, SHA-256 fingerprint; back both files up somewhere safe
Refuses to overwrite an existing keystore. With Play App Signing a lost upload key can be reset
through Play Console support, but keep a backup anyway.
"""
import datetime, secrets, string, sys
from pathlib import Path
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID

out = Path(sys.argv[1] if len(sys.argv) > 1 else r"D:\mahabharat-secrets")
out.mkdir(parents=True, exist_ok=True)
ks = out / "upload-keystore.p12"
if ks.exists():
    sys.exit(f"{ks} already exists, not overwriting")

alias = "mahabharat"
password = "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))

key = rsa.generate_private_key(public_exponent=65537, key_size=4096)
name = x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, "Mahabharat Katha"),
    x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Illuminati AI"),
    x509.NameAttribute(NameOID.COUNTRY_NAME, "IN"),
])
now = datetime.datetime.now(datetime.timezone.utc)
cert = (x509.CertificateBuilder()
        .subject_name(name).issuer_name(name)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - datetime.timedelta(days=1))
        .not_valid_after(now + datetime.timedelta(days=365 * 30))  # Play requires validity past 2033
        .sign(key, hashes.SHA256()))

enc = (serialization.PrivateFormat.PKCS12.encryption_builder()
       .kdf_rounds(50000)
       .key_cert_algorithm(pkcs12.PBES.PBESv2SHA256AndAES256CBC)
       .hmac_hash(hashes.SHA256())
       .build(password.encode()))
ks.write_bytes(pkcs12.serialize_key_and_certificates(alias.encode(), key, cert, None, enc))

fp = cert.fingerprint(hashes.SHA256()).hex(":").upper()
(out / "KEYSTORE-README.txt").write_text(
    "Mahabharat Katha - Play Store UPLOAD key\n"
    f"Created: {now:%Y-%m-%d}\n\n"
    f"File:      {ks.name}  (PKCS12)\n"
    f"Alias:     {alias}\n"
    f"Password:  {password}   (same for store and key)\n"
    f"SHA-256:   {fp}\n\n"
    "Back up this folder (both files) to a private place such as a password manager or encrypted drive.\n"
    "Never commit it to git. GitHub Actions holds copies as encrypted repository secrets.\n",
    encoding="utf-8")
print(f"created {ks}")
print(f"sha256 {fp}")
